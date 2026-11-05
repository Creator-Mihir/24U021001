from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.services.retrieval import retrieve_heritage
from app.services.prompt_builder import build_enriched_prompt
from app.services.image_generator import generate_image


router = APIRouter(
    prefix="/generation",
    tags=["Generation"]
)


class PromptRequest(BaseModel):
    prompt: str
    top_k: int = 3


@router.post("/generate")
def generate(request: PromptRequest):

    # 1. Retrieve cultural heritage
    results = retrieve_heritage(
        request.prompt,
        request.top_k,
        min_score=0.25
    )

    # 2. No relevant cultural information
    if not results:
        return {
            "original_prompt": request.prompt,
            "message": (
                "I could not find enough relevant cultural "
                "information. Please add more details."
            ),
            "retrieved_heritage": [],
            "enriched_prompt": None,
            "image_path": None
        }

    # 3. Build final image prompt
    enriched_prompt = build_enriched_prompt(
        request.prompt,
        results
    )

    # 4. Generate image
    try:
        image_path = generate_image(
            enriched_prompt
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during image generation."
        )

    # 5. Prepare retrieved heritage information
    retrieved_heritage = []

    for result in results:

        heritage = result["heritage"]

        retrieved_heritage.append(
            {
                "name": heritage.get("name"),
                "category": heritage.get("category"),
                "subcategory": heritage.get("subcategory"),
                "score": result["score"]
            }
        )

    return {
        "original_prompt": request.prompt,
        "retrieved_heritage": retrieved_heritage,
        "enriched_prompt": enriched_prompt,
        "image_url": f"/generated/{image_path}"
    }