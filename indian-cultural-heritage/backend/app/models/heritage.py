from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class Location(BaseModel):
    country: str = "India"
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None


class Period(BaseModel):
    era: Optional[str] = None
    origin: Optional[str] = None
    time_period: Optional[str] = None


class VisualContext(BaseModel):
    attire: List[str] = Field(default_factory=list)
    jewellery: List[str] = Field(default_factory=list)
    objects: List[str] = Field(default_factory=list)
    architecture: List[str] = Field(default_factory=list)
    environment: List[str] = Field(default_factory=list)
    colors_patterns: List[str] = Field(default_factory=list)
    activities: List[str] = Field(default_factory=list)


class AudioContext(BaseModel):
    music: List[str] = Field(default_factory=list)
    instruments: List[str] = Field(default_factory=list)


class Source(BaseModel):
    name: str
    url: Optional[str] = None


class HeritageCreate(BaseModel):
    name: str

    category: str
    subcategory: str

    heritage_type: str  # tangible / intangible

    location: Location = Field(default_factory=Location)
    period: Period = Field(default_factory=Period)

    description: str
    history: Optional[str] = None
    cultural_significance: Optional[str] = None

    traditions: List[str] = Field(default_factory=list)
    rituals: List[str] = Field(default_factory=list)
    communities: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)

    visual_context: VisualContext = Field(
        default_factory=VisualContext
    )

    audio_context: AudioContext = Field(
        default_factory=AudioContext
    )

    related_heritage: List[str] = Field(default_factory=list)

    keywords: List[str] = Field(default_factory=list)

    # Text specifically useful for image-prompt generation
    generation_context: Optional[str] = None

    sources: List[Source] = Field(default_factory=list)

    status: str = "pending"


class HeritageInDB(HeritageCreate):
    id: Optional[str] = None

    created_by: Optional[str] = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )