from typing import List, Optional
from typing_extensions import Annotated
from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

PyObjectId = Annotated[str, BeforeValidator(str)]


class NoteCardModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str = Field(...)
    text: str = Field(...)
    position: dict = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "title": "Ideas",
                "text": "- Some cool ideas!",
                "position": str({"x": 20, "y": 20}),
            }
        },
    )

class UpdateCardModel(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    position: Optional[dict] = None
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "title": "Ideas",
                "text": "- Some cool ideas!",
                "position": str({"x": 20, "y": 20}),
            }
        },
    )


class CardCollection(BaseModel):
    cards: List[NoteCardModel]
