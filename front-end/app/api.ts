const BASE_URL = `http://localhost:8000`;

const createCard = async (title: string, text: string, position: Position) => {
  return await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      text,
      position,
    }),
  }).then((res) => res.json());
};

const getCards = async () => {
  return await fetch(`${BASE_URL}/cards`).then((res) => res.json());
};

const updateCard = async (card: Card) => {
  return await fetch(`${BASE_URL}/cards/${card.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: card.title,
      text: card.text,
      position: card.position,
    }),
  }).then((res) => res.json());
};

const deleteCard = async (card: Card) => {
  return await fetch(`${BASE_URL}/cards/${card.id}`, {
    method: "DELETE",
  });
};

export default { createCard, getCards, updateCard, deleteCard };
