from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.database.mongodb import heritage_collection
from app.models.heritage import HeritageCreate
from app.services.vector_index import rebuild_faiss_index


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/heritage")
def create_heritage(data: HeritageCreate):

    document = data.model_dump()

    now = datetime.now(timezone.utc)

    document["created_at"] = now
    document["updated_at"] = now

    result = heritage_collection.insert_one(document)

    rebuild_faiss_index()

    return {
        "message": "Heritage created successfully",
        "id": str(result.inserted_id)
    }


@router.get("/heritage")
def get_all_heritage():

    documents = list(
        heritage_collection.find()
    )

    for document in documents:
        document["_id"] = str(document["_id"])

    return documents


@router.get("/heritage/{heritage_id}")
def get_heritage(heritage_id: str):

    if not ObjectId.is_valid(heritage_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid heritage ID"
        )

    document = heritage_collection.find_one(
        {"_id": ObjectId(heritage_id)}
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Heritage not found"
        )

    document["_id"] = str(document["_id"])

    return document


@router.put("/heritage/{heritage_id}")
def update_heritage(
    heritage_id: str,
    data: HeritageCreate
):

    if not ObjectId.is_valid(heritage_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid heritage ID"
        )

    existing = heritage_collection.find_one(
        {"_id": ObjectId(heritage_id)}
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Heritage not found"
        )

    update_data = data.model_dump()

    update_data["updated_at"] = datetime.now(
        timezone.utc
    )

    heritage_collection.update_one(
        {"_id": ObjectId(heritage_id)},
        {"$set": update_data}
    )

    rebuild_faiss_index()

    return {
        "message": "Heritage updated successfully"
    }


@router.delete("/heritage/{heritage_id}")
def delete_heritage(heritage_id: str):

    if not ObjectId.is_valid(heritage_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid heritage ID"
        )

    result = heritage_collection.delete_one(
        {"_id": ObjectId(heritage_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Heritage not found"
        )

    rebuild_faiss_index()

    return {
        "message": "Heritage deleted successfully"
    }