import json
from pathlib import Path

import faiss
import numpy as np
from bson import ObjectId

from app.database.mongodb import heritage_collection
from app.services.embeddings import generate_embedding


BASE_DIR = Path(__file__).resolve().parent.parent.parent

VECTOR_STORE_DIR = BASE_DIR / "vector_store"

INDEX_PATH = VECTOR_STORE_DIR / "index.faiss"
METADATA_PATH = VECTOR_STORE_DIR / "metadata.json"


def load_vector_store():

    index = faiss.read_index(
        str(INDEX_PATH)
    )

    with open(
        METADATA_PATH,
        "r",
        encoding="utf-8"
    ) as file:
        metadata = json.load(file)

    return index, metadata


def retrieve_heritage(
    query: str,
    top_k: int = 3,
    min_score: float = 0.25
):

    index, metadata = load_vector_store()

    if index.ntotal == 0:
        return []


    query_embedding = generate_embedding(
        query
    )

    query_embedding = np.array(
        [query_embedding],
        dtype="float32"
    )


    actual_top_k = min(
        top_k,
        index.ntotal
    )


    scores, indices = index.search(
        query_embedding,
        actual_top_k
    )


    results = []


    for score, index_position in zip(
        scores[0],
        indices[0]
    ):

        if index_position == -1:
            continue


        meta = metadata[index_position]

        mongo_id = meta["mongo_id"]


        document = heritage_collection.find_one(
            {
                "_id": ObjectId(mongo_id)
            }
        )


        if document:

            document["_id"] = str(
                document["_id"]
            )

            results.append(
                {
                    "score": float(score),
                    "heritage": document
                }
            )


    if results and results[0]["score"] < min_score:
        return []


    return results