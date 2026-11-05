def build_enriched_prompt(
    user_prompt: str,
    retrieved_records: list
) -> str:

    if not retrieved_records:
        return user_prompt

    cultural_context = []
    used_context_types = set()

    for result in retrieved_records:

        heritage = result["heritage"]

        visual = heritage.get(
            "visual_context",
            {}
        )

        location = heritage.get(
            "location",
            {}
        )

        details = []

        # Only add fields that actually contain information
        context_fields = {
            "attire": "attire",
            "jewellery": "jewellery",
            "objects": "objects",
            "architecture": "architecture",
            "environment": "environment",
            "activities": "activities",
            "colors_patterns": "colors and patterns"
        }

        for field, label in context_fields.items():

            values = visual.get(field, [])

            if values:
                details.append(
                    f"{label}: {', '.join(values)}"
                )
                used_context_types.add(label)

        region = location.get("state")

        heritage_text = (
            f"{heritage.get('name', '')}"
        )

        if region:
            heritage_text += f" from {region}"

        if details:
            cultural_context.append(
                heritage_text
                + "\n"
                + "\n".join(details)
            )

    if not cultural_context:
        return user_prompt

    context_text = "\n\n".join(
        cultural_context
    )

    authenticity_types = ", ".join(
        sorted(used_context_types)
    )

    enriched_prompt = f"""
Create an image based on this request:

{user_prompt}

Relevant Indian cultural context:

{context_text}

Maintain cultural authenticity in:
{authenticity_types}.

Do not introduce unrelated cultural elements.
""".strip()

    return enriched_prompt