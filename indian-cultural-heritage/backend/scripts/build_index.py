import json
from pathlib import Path

import faiss
import numpy as np

from app.database.mongodb import heritage_collection
from app.services.embeddings import generate_embedding


BASE_DIR = Path(__file__).resolve().parent.parent

VECTOR_STORE_DIR = BASE_DIR / "vector_store"

INDEX_PATH = VECTOR_STORE_DIR / "index.faiss"
METADATA_PATH = VECTOR_STORE_DIR / "metadata.json"


def create_search_text(record):
    """
    Combine important cultural information into
    one text that will be embedded.
    """

    visual = record.get("visual_context", {})
    audio = record.get("audio_context", {})
    location = record.get("location", {})
    period = record.get("period", {})

    text = f"""
    Name: {record.get('name', '')}

    Category: {record.get('category', '')}

    Subcategory: {record.get('subcategory', '')}

    Heritage Type: {record.get('heritage_type', '')}

    Location:
    State: {location.get('state', '')}
    Region: {location.get('region', '')}

    Period:
    Era: {period.get('era', '')}
    Origin: {period.get('origin', '')}

    Description:
    {record.get('description', '')}

    History:
    {record.get('history', '')}

    Cultural Significance:
    {record.get('cultural_significance', '')}

    Traditions:
    {', '.join(record.get('traditions', []))}

    Rituals:
    {', '.join(record.get('rituals', []))}

    Communities:
    {', '.join(record.get('communities', []))}

    Languages:
    {', '.join(record.get('languages', []))}

    Attire:
    {', '.join(visual.get('attire', []))}

    Jewellery:
    {', '.join(visual.get('jewellery', []))}

    Objects:
    {', '.join(visual.get('objects', []))}

    Architecture:
    {', '.join(visual.get('architecture', []))}

    Environment:
    {', '.join(visual.get('environment', []))}

    Activities:
    {', '.join(visual.get('activities', []))}

    Music:
    {', '.join(audio.get('music', []))}

    Instruments:
    {', '.join(audio.get('instruments', []))}

    Related Heritage:
    {', '.join(record.get('related_heritage', []))}

    Keywords:
    {', '.join(record.get('keywords', []))}

    Generation Context:
    {record.get('generation_context', '')}
    """

    return " ".join(text.split())


def build_index():

    print("Reading cultural heritage data from MongoDB...")

    records = list(
        heritage_collection.find(
            {"status": "approved"}
        )
    )

    if not records:
        print("No approved heritage records found.")
        return

    texts = []
    metadata = []

    for record in records:

        search_text = create_search_text(record)

        texts.append(search_text)

        metadata.append({
            "mongo_id": str(record["_id"]),
            "name": record.get("name"),
            "category": record.get("category"),
            "subcategory": record.get("subcategory")
        })

    print(f"Found {len(records)} heritage records.")

    print("Generating embeddings...")

    embeddings = []

    for text in texts:

        embedding = generate_embedding(text)

        embeddings.append(embedding)

    embeddings = np.array(
        embeddings,
        dtype="float32"
    )

    dimension = embeddings.shape[1]

    print(f"Embedding dimension: {dimension}")

    index = faiss.IndexFlatIP(dimension)

    index.add(embeddings)

    VECTOR_STORE_DIR.mkdir(
        parents=True,
        exist_ok=True
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
            indent=4,
            ensure_ascii=False
        )

    print()
    print("FAISS index created successfully.")
    print(f"Vectors stored: {index.ntotal}")
    print(f"Index: {INDEX_PATH}")
    print(f"Metadata: {METADATA_PATH}")


if __name__ == "__main__":
    build_index()