import json
from pathlib import Path

import faiss
import numpy as np

from app.database.mongodb import heritage_collection
from app.services.embeddings import generate_embedding


BASE_DIR = Path(__file__).resolve().parent.parent.parent

VECTOR_STORE_DIR = BASE_DIR / "vector_store"

INDEX_PATH = VECTOR_STORE_DIR / "index.faiss"
METADATA_PATH = VECTOR_STORE_DIR / "metadata.json"


VECTOR_STORE_DIR.mkdir(exist_ok=True)


def create_search_text(heritage):

    visual = heritage.get(
        "visual_context",
        {}
    )

    audio = heritage.get(
        "audio_context",
        {}
    )

    location = heritage.get(
        "location",
        {}
    )

    parts = [
        heritage.get("name", ""),
        heritage.get("category", ""),
        heritage.get("subcategory", ""),
        heritage.get("heritage_type", ""),
        location.get("state", ""),
        location.get("district", ""),
        location.get("city", ""),
        location.get("region", ""),
        heritage.get("description", ""),
        heritage.get("history", ""),
        heritage.get("cultural_significance", ""),
        " ".join(heritage.get("traditions", [])),
        " ".join(heritage.get("rituals", [])),
        " ".join(heritage.get("communities", [])),
        " ".join(heritage.get("languages", [])),
        " ".join(visual.get("attire", [])),
        " ".join(visual.get("jewellery", [])),
        " ".join(visual.get("objects", [])),
        " ".join(visual.get("architecture", [])),
        " ".join(visual.get("environment", [])),
        " ".join(visual.get("colors_patterns", [])),
        " ".join(visual.get("activities", [])),
        " ".join(audio.get("music", [])),
        " ".join(audio.get("instruments", [])),
        " ".join(heritage.get("keywords", [])),
        heritage.get("generation_context", ""),
    ]

    return " ".join(
        str(part)
        for part in parts
        if part
    )


def rebuild_faiss_index():

    documents = list(
        heritage_collection.find()
    )

    if not documents:

        index = faiss.IndexFlatIP(384)

        faiss.write_index(
            index,
            str(INDEX_PATH)
        )

        with open(
            METADATA_PATH,
            "w",
            encoding="utf-8"
        ) as file:
            json.dump([], file)

        return


    embeddings = []
    metadata = []


    for document in documents:

        text = create_search_text(
            document
        )

        embedding = generate_embedding(
            text
        )

        embeddings.append(
            embedding
        )

        metadata.append(
            {
                "mongo_id": str(
                    document["_id"]
                )
            }
        )


    embeddings = np.array(
        embeddings,
        dtype="float32"
    )


    index = faiss.IndexFlatIP(
        embeddings.shape[1]
    )

    index.add(
        embeddings
    )


    faiss.write_index(
        index,
        str(INDEX_PATH)
    )


    with open(
        METADATA_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            metadata,
            file,
            indent=2
        )


    print(
        f"FAISS index rebuilt: {len(documents)} records"
    )