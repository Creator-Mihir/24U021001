import json
from pathlib import Path

from app.database.mongodb import (
    heritage_collection,
    categories_collection
)


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


def seed_heritage():
    file_path = DATA_DIR / "seed_data.json"

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    # Prevent duplicate insertion
    heritage_collection.delete_many({})

    result = heritage_collection.insert_many(data)

    print(f"Inserted {len(result.inserted_ids)} heritage records.")


def seed_categories():
    categories = [
        {
            "name": "Performing Arts",
            "subcategories": [
                "Classical Dance",
                "Folk Dance",
                "Classical Theatre",
                "Folk Theatre",
                "Puppetry",
                "Traditional Performance"
            ],
            "status": "active"
        },
        {
            "name": "Festivals & Traditions",
            "subcategories": [
                "Religious Festivals",
                "Harvest Festivals",
                "Traditional Rituals",
                "Traditional Customs"
            ],
            "status": "active"
        },
        {
            "name": "Arts & Crafts",
            "subcategories": [
                "Traditional Painting",
                "Handicrafts",
                "Pottery",
                "Traditional Sculpture",
                "Decorative Arts"
            ],
            "status": "active"
        },
        {
            "name": "Architecture & Monuments",
            "subcategories": [
                "Temples",
                "Mosques",
                "Churches",
                "Forts",
                "Palaces",
                "Stepwells",
                "Caves",
                "Historic Structures"
            ],
            "status": "active"
        },
        {
            "name": "Food & Cuisine",
            "subcategories": [
                "Regional Cuisine",
                "Traditional Dishes",
                "Traditional Sweets",
                "Street Food",
                "Traditional Beverages",
                "Food Traditions"
            ],
            "status": "active"
        },
        {
            "name": "Clothing & Textiles",
            "subcategories": [
                "Traditional Clothing",
                "Regional Clothing",
                "Handloom",
                "Traditional Fabrics",
                "Embroidery",
                "Textile Techniques"
            ],
            "status": "active"
        },
        {
            "name": "Music & Instruments",
            "subcategories": [
                "Classical Music",
                "Folk Music",
                "Devotional Music",
                "String Instruments",
                "Wind Instruments",
                "Percussion Instruments"
            ],
            "status": "active"
        },
        {
            "name": "Literature & Folklore",
            "subcategories": [
                "Epics",
                "Mythology",
                "Folktales",
                "Legends",
                "Oral Traditions",
                "Classical Literature"
            ],
            "status": "active"
        },
        {
            "name": "Historical Heritage",
            "subcategories": [
                "Ancient India",
                "Medieval India",
                "Colonial India",
                "Freedom Movement",
                "Historical Battles",
                "Historical Cities",
                "Historical Trade"
            ],
            "status": "active"
        },
        {
            "name": "People & Personalities",
            "subcategories": [
                "Freedom Fighters",
                "Ancient Rulers",
                "Medieval Rulers",
                "Scholars",
                "Saints & Philosophers",
                "Artists",
                "Musicians"
            ],
            "status": "active"
        },
        {
            "name": "Religious & Spiritual Heritage",
            "subcategories": [
                "Hindu Heritage",
                "Buddhist Heritage",
                "Jain Heritage",
                "Sikh Heritage",
                "Sufi Heritage",
                "Spiritual Practices",
                "Pilgrimage Sites"
            ],
            "status": "active"
        },
        {
            "name": "Archaeological Heritage",
            "subcategories": [
                "Ancient Civilizations",
                "Archaeological Sites",
                "Rock-Cut Heritage",
                "Ancient Architecture",
                "Archaeological Artefacts",
                "Inscriptions",
                "Archaeological Museums"
            ],
            "status": "active"
        }
    ]

    categories_collection.delete_many({})

    result = categories_collection.insert_many(categories)

    print(f"Inserted {len(result.inserted_ids)} categories.")


if __name__ == "__main__":
    print("Seeding database...")

    seed_categories()
    seed_heritage()

    print("Database seeding completed.")