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
    lastPlayerDrew: boolean //True se l'ultimo giocatore ha pescato
) {
    //restituisce true se oldCard è una carta draw2 o draw4 altrimenti false
    const isOldDrawingCard = oldCard?.action && oldCard.action.indexOf("draw") !== -1;

    //Sarà true solo se il giocatore precedente ha giocato una carta draw e se il giocatore corrente non ha ancora pescato
    const haveToDraw = isOldDrawingCard && !lastPlayerDrew;

    //restituisce true se newCard è una carta draw2 o draw4 altrimenti false
    const isNewDrawingCard = newCard?.action && newCard.action.indexOf("draw") !== -1;

    //Nessuna carta ancora giocata
    //if (!oldCard) return true;

    // Se non devo pescare, allora le carte black sono sempre giocabili
    if (!haveToDraw && newCard.color === "black") return true;

    // Se non devo pescare, e nel mazzo degli scarti c'è una carta black, allora tutte le carte sono giocabili
    if (oldCard.color === "black" && !haveToDraw) return true;

    // Se la carta precedente è una carta draw2 o draw4, e devo quindi pescare, non posso rispondere con draw2 o draw4
    if (isOldDrawingCard && isNewDrawingCard && haveToDraw) return false;

    // Una carta dello stesso colore di quella nel mazzo degli scarti, è giocabile se non devo pescare
    if (!haveToDraw && oldCard.color === newCard.color) return true;

    // Se la carta in mano ha la stessa action di quella nel mazzo degli scarti, è giocabile
    if (oldCard.action !== undefined && newCard.action !== undefined && oldCard.action === newCard.action) return true;

    // Se la carta in mano ha lo stesso numero di quella nel mazzo degli scarti, è giocabile. Altrimenti no
    return oldCard.digit !== undefined && oldCard.digit === newCard.digit;

}

export function canPlayCardSelectableColor(
    color: string,
    oldCard: Card,
    newCard: Card,
    lastPlayerDrew: boolean //True se l'ultimo giocatore ha pescato
) {

    //restituisce true se oldCard è una carta draw4 altrimenti false
    const isOldDrawingFourCard = oldCard?.action && oldCard.action === "draw4";

    //Sarà true solo se il giocatore precedente ha giocato una carta draw e se il giocatore corrente non ha ancora pescato
    const haveToDraw = isOldDrawingFourCard && !lastPlayerDrew;

    if (isOldDrawingFourCard && !haveToDraw && (newCard.color === color)) return true;

    if (newCard.color === "black" && !haveToDraw) return true;

    if (isOldDrawingFourCard) return false;

    // Se non devo pescare, allora le carte black sono sempre giocabili
    return color === newCard.color;
}