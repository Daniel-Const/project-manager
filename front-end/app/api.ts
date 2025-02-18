const BASE_URL = `http://localhost:8000`;

export const createCard = async (
  title: string,
  text: string,
  position: Position
) => {
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

export const getCards = async () => {
  return await fetch(`${BASE_URL}/cards`).then((res) => res.json());
};

export const updateCard = async (card: Card) => {
  console.log(card.id);
  console.log(card);
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
