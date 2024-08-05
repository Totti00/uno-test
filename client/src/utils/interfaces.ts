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