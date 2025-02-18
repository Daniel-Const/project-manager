from bson import ObjectId
from fastapi import Body, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import ReturnDocument

import motor.motor_asyncio

from model import CardCollection, NoteCardModel, UpdateCardModel

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient(
    "mongodb://localhost:27017"
)  # os.environ["MONGODB_URL"])
db = client.projectmanager
card_collection = db.get_collection("cards")

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])


@app.get(
    "/cards/",
    response_description="Get a list of all Cards",
    response_model=CardCollection,
    response_model_by_alias=False,
)
async def get_all_cards():
    cards = await card_collection.find().to_list()
    print(cards)
    return CardCollection(cards=cards)


@app.post(
    "/cards/",
    response_description="Create a new Card",
    response_model=NoteCardModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_card(card: NoteCardModel = Body(...)):
    new_card = await card_collection.insert_one(card.model_dump(by_alias=True))
    created_card = await card_collection.find_one({"_id": new_card.inserted_id})
    return created_card


@app.put(
    "/cards/{id}",
    response_description="Update a Card",
    response_model=NoteCardModel,
    response_model_by_alias=False,
)
async def update_card(id: str, card: UpdateCardModel = Body(...)):
    print("UPDATING CARD with id: ", id)
    card = {k: v for k, v in card.model_dump(by_alias=True).items() if v is not None}
    print(card)
    if len(card) >= 1:
        update_result = await card_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": card},
            return_document=ReturnDocument.AFTER,
        )
        if update_result is not None:
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"Card {id} not found")

    if (existing_card := await card_collection.find_one({"_id": id})) is not None:
        return existing_card

    raise HTTPException(status_code=404, detail=f"Student {id} not found")
