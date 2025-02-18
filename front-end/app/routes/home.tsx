import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Canvas from "~/canvas/Canvas";
import { NoteCard } from "~/cards/NoteCard";
import Toolbar from "~/canvas/Toolbar";
import { createCard, getCards, updateCard } from "~/api";
import SaveIcon from "~/canvas/SaveIcon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showSaveIcon, setSaveIcon] = useState(false);

  const fetchCards = async () => {
    getCards().then((body: { cards: Card[] }) => setCards(body.cards));
  };

  // Fetch cards from the DB
  useEffect(() => {
    fetchCards();
  }, []);

  const handleCreateCard = async () => {
    const newCard = await createCard("Notes", "Some cool notes here...", {
      x: 300,
      y: 300,
    });
    setCards([...cards, newCard]);
  };

  const handleSave = async () => {
    setSaveIcon(true);
    for (const card of cards) {
      await updateCard(card);
    }
    setSaveIcon(false);
  };

  const handleCardChange = (
    idx: number,
    title: string,
    text: string,
    position: Position
  ) => {
    console.log("UPDATING CARD")
    console.log(title, text, position);
    setCards(
      cards.map((card, i) =>
        i == idx ? { id: card.id, title, text, position } : card
      )
    );
    console.log(cards);
  };

  return (
    <>
      {showSaveIcon ? <SaveIcon /> : ""}
      <Toolbar onCreateCard={handleCreateCard} onSave={handleSave} />
      <Canvas>
        {cards.map((card, idx) => (
          <NoteCard
            data={card}
            handleChange={(title, text, position) =>
              handleCardChange(idx, title, text, position)
            }
            pos={card.position}
            key={card.id}
          />
        ))}
      </Canvas>
    </>
  );
}
