from app.services.retrieval import retrieve_heritage
from app.services.prompt_builder import build_enriched_prompt


query = "Gujarati women celebrating a traditional festival with dancing"


print("\nUSER PROMPT")
print("------------")
print(query)


# Retrieve relevant heritage
results = retrieve_heritage(
    query,
    top_k=3
)


print("\nRETRIEVED HERITAGE")
print("------------------")

for result in results:

    heritage = result["heritage"]

    print(
        f"- {heritage['name']} "
        f"| score: {result['score']:.4f}"
    )


# Build enriched prompt
enriched_prompt = build_enriched_prompt(
    query,
    results
)


print("\nENRICHED PROMPT")
print("----------------")
print(enriched_prompt)