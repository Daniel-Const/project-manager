import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import Canvas from "~/canvas/Canvas";
import { NoteCard } from "~/cards/NoteCard";
import Toolbar from "~/canvas/Toolbar";
import SaveIcon from "~/canvas/SaveIcon";
import { BaseCard } from "~/canvas/BaseCard";
import initApi from "~/api";
import Drawbar from "~/canvas/Drawbar";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Project Management Canvas" },
    {
      name: "description",
      content: "Add customisable cards to organise and manage a proejct",
    },
  ];
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showSaveIcon, setSaveIcon] = useState(false);

  const api = initApi();

  const fetchCards = async () => {
    api
      .getCards()
      .then((body: { cards: Card[] }) => {
        setCards(body.cards);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Fetch cards from the DB
  useEffect(() => {
    fetchCards();
  }, []);

  const numberOfCards = cards.length;
  const handleCreateCard = async () => {
    const newCard = await api.createCard(
      "Notes",
      "Some cool notes here...",
      {
        x: 300,
        y: 300,
      },
      {
        width: 300,
        height: 300,
      }
    );
    const newCards = [...cards, newCard];
    setCards(newCards);
  };

  const handleSave = async (cards: Card[]) => {
    setSaveIcon(true);
    for (const card of cards) {
      await api.updateCard(card);
    }
    setTimeout(() => {
      setSaveIcon(false);
    }, 1000)
  };

  const updateCard = (
    index: number,
    updatedFields: {
      title?: string;
      text?: string;
      position?: Position;
      size?: Dimensions;
    }
  ) => {
    setCards((_cards) =>
      _cards.map((card, i) =>
        i === index ? { ...card, ...updatedFields } : card
      )
    );
  };

  const deleteCard = async (idx: number) => {
    if (idx >= cards.length || idx < 0) {
      console.error("Failed to delete card: Invalid index");
      return;
    }

    const newCards = [...cards];
    const card = newCards.splice(idx, 1);
    api
      .deleteCard(card[0])
      .then(() => setCards(newCards))
      .catch((err) =>
        console.error(`Failed to delete Card at index: ${idx}; ${err}`)
      );
  };

  return (
    <>
      {showSaveIcon ? <SaveIcon /> : ""}
      <Toolbar
        onCreateCard={handleCreateCard}
        onSave={() => handleSave(cards)}
      />

      <Drawbar />

      <Canvas drawColor={"white"}>
        {cards.map((card, idx) => (
          <BaseCard
            onPositionUpdate={(position: Position) => {
              updateCard(idx, { position });
            }}
            onSizeUpdate={(size: Dimensions) => {
              updateCard(idx, { size });
            }}
            onDelete={() => deleteCard(idx)}
            pos={card.position}
            dim={card.size}
            key={`${numberOfCards}-${idx}`}
          >
            <NoteCard
              data={card}
              handleChange={(title, text) => updateCard(idx, { title, text })}
            />
          </BaseCard>
        ))}
      </Canvas>
    </>
  );
}
