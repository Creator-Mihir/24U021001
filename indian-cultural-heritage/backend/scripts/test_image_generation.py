import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.services.image_generator import generate_image


prompt = """
Create a realistic image of Gujarati women
performing Garba during a traditional Gujarati festival.

Include:
- traditional chaniya choli and kediyu
- Gujarati jewellery
- circular group dancing
- decorated festival ground
- traditional Gujarati patterns

Maintain authentic Gujarati cultural details.
Do not introduce unrelated cultural elements.
"""


image_path = generate_image(prompt)

print("Image generated successfully!")
print("Saved at:", image_path)