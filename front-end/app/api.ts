const BASE_URL = `http://localhost:8000`;

abstract class AbstractApi {
  constructor() {}
  abstract createCard: (
    title: string,
    text: string,
    position: Position,
    size: Dimensions
  ) => Promise<Card>;
  abstract getCards: () => Promise<{ cards: Card[] }>;
  abstract updateCard: (card: Card) => Promise<Card>;
  abstract deleteCard: (card: Card) => any;
}

class BackEndApi extends AbstractApi {
  createCard = async (
    title: string,
    text: string,
    position: Position,
    size: Dimensions
  ) => {
    return await fetch(`${BASE_URL}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        text,
        position,
        size,
      }),
    }).then((res) => res.json());
  };

  getCards = async () => {
    return await fetch(`${BASE_URL}/cards`).then((res) => res.json());
  };

  updateCard = async (card: Card) => {
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

  deleteCard = async (card: Card) => {
    return await fetch(`${BASE_URL}/cards/${card.id}`, {
      method: "DELETE",
    });
  };
}

interface ILocalStorageData {
  cards: Card[];
}

class LocalApi extends AbstractApi {
  storageDataKey = "project-data";
  maxCurrentId = -1;

  #initMaxCurrentId = () => {
    if (this.maxCurrentId >= 0) return;
    const data = this.#fetchData();
    // Determine the current largest ID that is a string representation of a valid number
    // If none are valid numbers: ID generation uses integer increments so there shouldn't be clashes anyway
    // (Since future Ids will represent valid integers)
    if (data) {
      const validNumIds = data.cards
        .map((c) => Number(c.id))
        .filter((id) => !!id);
      this.maxCurrentId = validNumIds.length > 0 ? Math.max(...validNumIds) : 0;
    }
  };

  #fetchData = (): ILocalStorageData | null => {
    const data = localStorage.getItem(this.storageDataKey);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  };

  #updateData = (data: ILocalStorageData): void => {
    localStorage.setItem(this.storageDataKey, JSON.stringify(data));
  };

  #createNewId = (): string => {
    this.maxCurrentId += 1;
    return `${this.maxCurrentId}`;
  };

  createCard = async (
    title: string,
    text: string,
    position: Position,
    size: Dimensions
  ): Promise<Card> => {
    // Check if maxCurrentId is initialised
    this.#initMaxCurrentId();

    const data = this.#fetchData();
    const id = this.#createNewId();
    const newCard = {
      id,
      title,
      text,
      position,
      size,
    };

    const cards = data ? [...data.cards, newCard] : [newCard];
    this.#updateData({ cards });

    return new Promise((resolve) => {
      resolve(newCard);
    });
  };

  getCards = async (): Promise<{ cards: Card[] }> => {
    const data = this.#fetchData();
    let cards: Card[] = [];
    if (data) {
      cards = data.cards;
    }

    return new Promise((resolve, _) => {
      resolve({ cards });
    });
  };

  updateCard = async (card: Card): Promise<Card> => {
    console.log("Updating Card!!");
    const data = this.#fetchData();
    if (data) {
      const payload = {
        cards: data.cards.map((c) => (c.id == card.id ? card : c)),
      };
      this.#updateData(payload);
    } else {
      // Somethings gone wrong... Can't update a card that doesn't exist
      return new Promise((_, reject) => {
        reject("Cannot update card! No data in local storage");
      });
    }

    return new Promise((resolve, _) => {
      resolve(card);
    });
  };

  deleteCard = async (card: Card) => {
    const data = this.#fetchData();
    if (data) {
      this.#updateData({ cards: data.cards.filter((c) => c.id != card.id) });
    }
  };
}

export default function initApi() {
  // TODO: Move to environment variable
  const useBackend = false;
  if (useBackend) {
    return new BackEndApi();
  } else {
    return new LocalApi();
  }
}
