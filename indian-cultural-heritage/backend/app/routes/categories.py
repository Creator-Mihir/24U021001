from typing import List, Optional
from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

    subcategories: List[str] = Field(
        default_factory=list
    )

    status: str = "active"


class CategoryInDB(CategoryCreate):
    id: Optional[str] = None