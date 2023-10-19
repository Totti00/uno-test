export interface Player {
    id: string;
    name: string;
    cards: Card[];
    color: string; //colore visualizzato in chat
}

export interface Card {
    _id?: string;
    layoutId?: string;
    digit?: number;
    color?: "red" | "blue" | "green" | "yellow" | "black";
    action?: "skip" | "reverse" | "draw2" | "draw4" | "wild";
    flip?: boolean;
    rotationY?: number;
    playable?: boolean;
    forPlayer?: number;
}

export interface GameServer {
    id: string;
    name: string;
    cntPlayers: string;
}

export interface Message {
    player: Player;
    text: string;
    id: string;
}

export function canPlayCard(
    oldCard: Card,
    newCard: Card,
    lastPlayerDrew: boolean
) {
    const isOldDawingCard =
        oldCard?.action && oldCard.action.indexOf("draw") !== -1;
    const haveToDraw = isOldDawingCard && !lastPlayerDrew;
    const isNewDawingCard =
        newCard?.action && newCard.action.indexOf("draw") !== -1;

    //No CardTSX Played Yet
    if (!oldCard) return true;

    if (!haveToDraw && newCard.action === "wild") return true;

    if (newCard.action === "draw4") return true;

    if (oldCard.color === "black" && !haveToDraw) return true;

    if (haveToDraw && isNewDawingCard) return true;

    if (!haveToDraw && oldCard.color === newCard.color) return true;

    if (oldCard.digit !== undefined && oldCard.digit === newCard.digit)
        return true;

    return false;
}