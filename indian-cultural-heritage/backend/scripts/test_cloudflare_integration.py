import base64
import io
import os
import unittest
from unittest.mock import patch, MagicMock
from pathlib import Path

from PIL import Image
from fastapi.testclient import TestClient

from app.main import app, GENERATED_IMAGES_DIR
from app.services.image_generator import (
    generate_image,
    ImageGenerationError,
    MODEL_NAME
)


class TestCloudflareImageGenerator(unittest.TestCase):

    def setUp(self):
        # Create a small valid test image in base64
        img = Image.new("RGB", (64, 64), color=(200, 100, 50))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        self.sample_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        self.mock_cf_success_response = {
            "result": {
                "image": self.sample_b64
            },
            "success": True,
            "errors": [],
            "messages": [],
            "usage": {"neurons": 172.8}
        }

    def test_missing_account_id(self):
        with patch.dict(os.environ, {"CLOUDFLARE_ACCOUNT_ID": "", "CLOUDFLARE_API_TOKEN": "token"}):
            with self.assertRaises(ImageGenerationError) as ctx:
                generate_image("A temple in Gujarat")
            self.assertEqual(ctx.exception.status_code, 500)
            self.assertIn("CLOUDFLARE_ACCOUNT_ID", ctx.exception.detail)

    def test_missing_api_token(self):
        with patch.dict(os.environ, {"CLOUDFLARE_ACCOUNT_ID": "acc123", "CLOUDFLARE_API_TOKEN": ""}):
            with self.assertRaises(ImageGenerationError) as ctx:
                generate_image("A temple in Gujarat")
            self.assertEqual(ctx.exception.status_code, 500)
            self.assertIn("CLOUDFLARE_API_TOKEN", ctx.exception.detail)

    def test_empty_prompt(self):
        with self.assertRaises(ImageGenerationError) as ctx:
            generate_image("   ")
        self.assertEqual(ctx.exception.status_code, 400)

    @patch("httpx.Client.post")
    def test_successful_image_generation(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = self.mock_cf_success_response
        mock_post.return_value = mock_response

        with patch.dict(os.environ, {"CLOUDFLARE_ACCOUNT_ID": "test_acc", "CLOUDFLARE_API_TOKEN": "test_token"}):
            filename = generate_image("Traditional Garba dance")

            # Check return format
            self.assertTrue(filename.endswith(".png"))
            saved_file = GENERATED_IMAGES_DIR / filename
            self.assertTrue(saved_file.exists())

            # Verify it's a valid PNG image
            with Image.open(saved_file) as img:
                self.assertEqual(img.format, "PNG")

            # Clean up test file
            saved_file.unlink(missing_ok=True)

    @patch("httpx.Client.post")
    def test_cf_authentication_failure(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.json.return_value = {
            "result": None,
            "success": False,
            "errors": [{"code": 10000, "message": "Authentication error"}],
            "messages": []
        }
        mock_post.return_value = mock_response

        with patch.dict(os.environ, {"CLOUDFLARE_ACCOUNT_ID": "test_acc", "CLOUDFLARE_API_TOKEN": "bad_token"}):
            with self.assertRaises(ImageGenerationError) as ctx:
                generate_image("Indian folk music")
            self.assertEqual(ctx.exception.status_code, 401)
            self.assertIn("authentication failed", ctx.exception.detail.lower())

    @patch("httpx.Client.post")
    def test_cf_rate_limit_429(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 429
        mock_response.json.return_value = {
            "result": None,
            "success": False,
            "errors": [{"code": 10010, "message": "Rate limit exceeded"}],
            "messages": []
        }
        mock_post.return_value = mock_response

        with patch.dict(os.environ, {"CLOUDFLARE_ACCOUNT_ID": "test_acc", "CLOUDFLARE_API_TOKEN": "test_token"}):
            with self.assertRaises(ImageGenerationError) as ctx:
                generate_image("Indian folk music")
            self.assertEqual(ctx.exception.status_code, 429)

    @patch("httpx.Client.post")
    def test_cf_success_false_response(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "result": None,
            "success": False,
            "errors": [{"code": 500, "message": "Model inference failed"}],
            "messages": []
        }
        mock_post.return_value = mock_response

        with patch.dict(os.environ, {"CLOUDFLARE_ACCOUNT_ID": "test_acc", "CLOUDFLARE_API_TOKEN": "test_token"}):
            with self.assertRaises(ImageGenerationError) as ctx:
                generate_image("Kathakali dancer")
            self.assertEqual(ctx.exception.status_code, 502)
            self.assertIn("Model inference failed", ctx.exception.detail)

    @patch("httpx.Client.post")
    def test_api_route_generate_endpoint(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = self.mock_cf_success_response
        mock_post.return_value = mock_response

        client = TestClient(app)
        response = client.post(
            "/generation/generate",
            json={"prompt": "Garba dance in Gujarat with traditional attire", "top_k": 2}
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("image_url", data)
        self.assertTrue(data["image_url"].startswith("/generated/"))
        self.assertTrue(data["image_url"].endswith(".png"))
        self.assertIn("retrieved_heritage", data)
        self.assertIn("enriched_prompt", data)

        # Cleanup generated file
        filename = data["image_url"].replace("/generated/", "")
        (GENERATED_IMAGES_DIR / filename).unlink(missing_ok=True)

    @patch("httpx.Client.post")
    def test_api_route_error_propagation(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.json.return_value = {
            "result": None,
            "success": False,
            "errors": [{"code": 10000, "message": "Invalid token"}],
            "messages": []
        }
        mock_post.return_value = mock_response

        client = TestClient(app)
        response = client.post(
            "/generation/generate",
            json={"prompt": "Garba dance in Gujarat with traditional attire", "top_k": 2}
        )

        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertIn("detail", data)
        self.assertIn("authentication failed", data["detail"].lower())


if __name__ == "__main__":
    unittest.main()
