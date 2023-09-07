import { Card } from "./interfaces";

const { cards } = require("./prova.json");

export const getCard = (cardId: string) =>
  (cards as Card[]).find((c) => c.id === cardId);
