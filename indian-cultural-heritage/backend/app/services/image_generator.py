import base64
import io
import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from fastapi import HTTPException
import httpx
from PIL import Image

# Ensure .env is loaded
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
GENERATED_IMAGES_DIR = BASE_DIR / "generated_images"

GENERATED_IMAGES_DIR.mkdir(exist_ok=True)

MODEL_NAME = "@cf/black-forest-labs/flux-1-schnell"


class ImageGenerationError(HTTPException):
    """Custom HTTP exception for image generation failures."""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


def generate_image(prompt: str) -> str:
    """
    Generates an image using Cloudflare Workers AI with FLUX.1-schnell.
    Decodes the Base64 response and saves it as a valid PNG to disk.
    Returns the filename of the saved PNG image.
    """
    if not prompt or not prompt.strip():
        raise ImageGenerationError(
            status_code=400,
            detail="Prompt cannot be empty for image generation."
        )

    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    api_token = os.getenv("CLOUDFLARE_API_TOKEN")

    if not account_id or not account_id.strip():
        raise ImageGenerationError(
            status_code=500,
            detail="Cloudflare Account ID (CLOUDFLARE_ACCOUNT_ID) is not configured in backend environment."
        )

    if not api_token or not api_token.strip():
        raise ImageGenerationError(
            status_code=500,
            detail="Cloudflare API Token (CLOUDFLARE_API_TOKEN) is not configured in backend environment."
        )

    endpoint_url = (
        f"https://api.cloudflare.com/client/v4/accounts/{account_id.strip()}/ai/run/{MODEL_NAME}"
    )

    headers = {
        "Authorization": f"Bearer {api_token.strip()}",
        "Content-Type": "application/json",
    }

    payload = {
        "prompt": prompt.strip()
    }

    # 60s timeout for image diffusion model with 10s connect timeout
    timeout = httpx.Timeout(60.0, connect=10.0)

    try:
        with httpx.Client(timeout=timeout) as client:
            response = client.post(endpoint_url, headers=headers, json=payload)
    except httpx.TimeoutException:
        raise ImageGenerationError(
            status_code=504,
            detail="Cloudflare Workers AI request timed out. Please try again later."
        )
    except httpx.NetworkError:
        raise ImageGenerationError(
            status_code=502,
            detail="Network error while connecting to Cloudflare Workers AI service."
        )
    except httpx.RequestError:
        raise ImageGenerationError(
            status_code=502,
            detail="Failed to send request to Cloudflare Workers AI service."
        )

    # Handle non-200 HTTP response codes
    if response.status_code != 200:
        error_detail = "Image generation service returned an error."
        try:
            err_json = response.json()
            if isinstance(err_json, dict):
                cf_errors = err_json.get("errors")
                if isinstance(cf_errors, list) and cf_errors:
                    extracted = [
                        e.get("message", "") for e in cf_errors if isinstance(e, dict) and e.get("message")
                    ]
                    if extracted:
                        error_detail = "; ".join(extracted)
        except Exception:
            pass

        if response.status_code in (401, 403):
            raise ImageGenerationError(
                status_code=response.status_code,
                detail=f"Cloudflare authentication failed: Invalid token or insufficient permissions. ({error_detail})"
            )
        elif response.status_code == 429:
            raise ImageGenerationError(
                status_code=429,
                detail="Cloudflare Workers AI rate limit or quota exceeded. Please try again later."
            )
        elif response.status_code == 404:
            raise ImageGenerationError(
                status_code=404,
                detail=f"Cloudflare model endpoint or account not found ({MODEL_NAME})."
            )
        elif 400 <= response.status_code < 500:
            raise ImageGenerationError(
                status_code=response.status_code,
                detail=f"Cloudflare Workers AI client error: {error_detail}"
            )
        else:
            raise ImageGenerationError(
                status_code=502,
                detail=f"Cloudflare Workers AI service error ({response.status_code}): {error_detail}"
            )

    # Parse response JSON
    try:
        data = response.json()
    except Exception:
        raise ImageGenerationError(
            status_code=502,
            detail="Cloudflare Workers AI returned an invalid JSON response."
        )

    if not isinstance(data, dict):
        raise ImageGenerationError(
            status_code=502,
            detail="Cloudflare Workers AI returned a malformed response body."
        )

    # Verify Cloudflare success status
    if not data.get("success", False):
        cf_errors = data.get("errors", [])
        err_messages = [
            e.get("message", "") for e in cf_errors if isinstance(e, dict) and e.get("message")
        ]
        detail_msg = "; ".join(err_messages) if err_messages else "Cloudflare AI indicated failure without details."
        raise ImageGenerationError(
            status_code=502,
            detail=f"Cloudflare Workers AI generation failed: {detail_msg}"
        )

    # Extract Base64 image
    result = data.get("result")
    if not isinstance(result, dict):
        raise ImageGenerationError(
            status_code=502,
            detail="Cloudflare Workers AI response missing 'result' object."
        )

    image_b64 = result.get("image")
    if not image_b64 or not isinstance(image_b64, str):
        raise ImageGenerationError(
            status_code=502,
            detail="Cloudflare Workers AI response missing image data."
        )

    # Decode Base64 data
    try:
        image_bytes = base64.b64decode(image_b64, validate=True)
        if not image_bytes:
            raise ValueError("Decoded image data is empty.")
    except Exception:
        raise ImageGenerationError(
            status_code=502,
            detail="Cloudflare Workers AI returned invalid or corrupted Base64 image data."
        )

    # Convert binary to genuine PNG format and save to storage
    try:
        image = Image.open(io.BytesIO(image_bytes))
        filename = f"{uuid.uuid4()}.png"
        output_path = GENERATED_IMAGES_DIR / filename
        image.save(output_path, format="PNG")
    except Exception:
        raise ImageGenerationError(
            status_code=500,
            detail="Failed to process and save the generated image to storage."
        )

    return filename