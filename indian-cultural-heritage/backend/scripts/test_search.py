import json
from pathlib import Path

import faiss
import numpy as np

from app.services.embeddings import generate_embedding


BASE_DIR = Path(__file__).resolve().parent.parent

INDEX_PATH = BASE_DIR / "vector_store" / "index.faiss"
METADATA_PATH = BASE_DIR / "vector_store" / "metadata.json"


index = faiss.read_index(
    str(INDEX_PATH)
)

with open(
    METADATA_PATH,
    "r",
    encoding="utf-8"
) as file:

    metadata = json.load(file)


query = "Gujarati women celebrating a traditional festival with dancing"

query_embedding = generate_embedding(query)

query_embedding = np.array(
    [query_embedding],
    dtype="float32"
)

scores, indices = index.search(
    query_embedding,
    3
)


print("\nQuery:")
print(query)

print("\nResults:")

for score, index_position in zip(scores[0], indices[0]):

    result = metadata[index_position]

    print(
        f"{result['name']} "
        f"({result['category']} → {result['subcategory']}) "
        f"| similarity={score:.4f}"
    )