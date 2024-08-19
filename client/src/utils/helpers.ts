import { Card } from "./interfaces";

export function wrapMod(n: number, len: number) {
    return (n + len) % len;
}

export function canPlayCard(
    oldCard: Card,
    newCard: Card,
    lastPlayerDrew: boolean //True if the last player drew a card
) {
    //returns true if oldCard is a draw2 or draw4 card, otherwise false
    const isOldDrawingCard = oldCard?.action && oldCard.action.indexOf("draw") !== -1;

    //It will be true only if the previous player played a draw card and the current player has not yet drawn
    const haveToDraw = isOldDrawingCard && !lastPlayerDrew;

    //returns true if newCard is a draw2 or draw4 card, otherwise false
    const isNewDrawingCard = newCard?.action && newCard.action.indexOf("draw") !== -1;

    // If I don't have to draw, then black cards are always playable
    if (!haveToDraw && newCard.color === "black") return true;

    // If I don't have to draw, and there is a black card in the discard pile, then all cards are playable
    if (oldCard.color === "black" && !haveToDraw) return true;

    // If the previous card is a draw2 or draw4 card, and I have to draw, I cannot respond with a draw2 or draw4
    if (isOldDrawingCard && isNewDrawingCard && haveToDraw) return false;

    // A card of the same color as the one in the discard pile is playable if I don't have to draw
    if (!haveToDraw && oldCard.color === newCard.color) return true;

    // If the card in hand has the same action as the one in the discard pile, it is playable
    if (oldCard.action !== undefined && newCard.action !== undefined && oldCard.action === newCard.action) return true;

    // If the card in hand has the same number as the one in the discard pile, it is playable. Otherwise, it is not.
    return oldCard.digit !== undefined && oldCard.digit === newCard.digit;

}

export function canPlayCardSelectableColor(
    color: string,
    oldCard: Card,
    newCard: Card,
    lastPlayerDrew: boolean //True if the last player drew a card
) {

    // returns true if oldCard is a draw4 card, otherwise false
    const isOldDrawingFourCard = oldCard?.action && oldCard.action === "draw4";

    // It will be true only if the previous player played a draw card and the current player has not yet drawn
    const haveToDraw = isOldDrawingFourCard && !lastPlayerDrew;

    if (isOldDrawingFourCard && !haveToDraw && (newCard.color === color)) return true;

    if (newCard.color === "black" && !haveToDraw) return true;

    if (isOldDrawingFourCard) return false;

    // If I don't have to draw, then black cards are always playable
    return color === newCard.color;
}

export function finalCanPlayCard(
    oldCard: Card,
    newCard: Card,
    lastPlayerDrew: boolean, //True if the last player drew a card
    color?: string,
) {
    if (color) {
        return canPlayCardSelectableColor(color, oldCard, newCard, lastPlayerDrew);
    } else {
        return canPlayCard(oldCard, newCard, lastPlayerDrew);
    }
}