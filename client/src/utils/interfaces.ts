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
    //restituisce true se oldCard è una carta draw2 o dra4 altrimenti false
    const isOldDrawingCard = oldCard?.action && oldCard.action.indexOf("draw") !== -1;

    //Sarà true solo se il giocatore precedente ha giocato una carta draw e se il giocatore corrente non ha ancora pescato
    const haveToDraw = isOldDrawingCard && !lastPlayerDrew;

    //restituisce true se newCard è una carta draw2 o draw4 altrimenti false
    const isNewDrawingCard = newCard?.action && newCard.action.indexOf("draw") !== -1;

    //No CardTSX Played Yet
    if (!oldCard) return true;

    if (!haveToDraw && newCard.action === "wild") return true;

    if (newCard.action === "draw4") return true;

    if (oldCard.color === "black" && !haveToDraw) return true;

    if (haveToDraw && isNewDrawingCard) return true;

    if (!haveToDraw && oldCard.color === newCard.color) return true;

    if (oldCard.action !== undefined && newCard.action !== undefined && oldCard.action === newCard.action) return true;

    if (oldCard.digit !== undefined && oldCard.digit === newCard.digit)
        return true;

    return false;
}