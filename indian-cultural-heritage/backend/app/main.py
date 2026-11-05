from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes.admin import router as admin_router
from app.routes.generation import router as generation_router


app = FastAPI(
    title="Indian Cultural Heritage API"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Path to backend/generated_images
BASE_DIR = Path(__file__).resolve().parent.parent
GENERATED_IMAGES_DIR = BASE_DIR / "generated_images"

# Create folder if it doesn't exist
GENERATED_IMAGES_DIR.mkdir(exist_ok=True)


# Serve generated images
app.mount(
    "/generated",
    StaticFiles(directory=str(GENERATED_IMAGES_DIR)),
    name="generated"
)


app.include_router(
    generation_router
)
app.include_router(
    admin_router
)


@app.get("/")
def root():
    return {
        "message": "Indian Cultural Heritage API"
    }