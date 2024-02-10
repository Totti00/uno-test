export interface IPlayer {
  id: string;
  name: string;
  seed: string;
  socketID: string;
  cards: ICard[];
  disconnected: boolean;
}

export interface IGameServer {
  serverId: string;
  serverName: string;
  players: IPlayer[];
  curPlayer: number;
  direction: 1 | -1;
  tableStk: ICard[];
  drawingStk: ICard[];
  sumDrawing: number;
  deck: [];
  gameRunning: boolean;
  lastPlayerDrew: boolean;
  playersFinished: number[];
  messages: string[];

  init(): Promise<void>;
  joinPlayer(player: IPlayer): string;
  leavePlayer(playerId: string): void;
  start(): any;
  chat(message: string): any;
  getChat(): any;
  move(draw: boolean, card: ICard /* | null */): IMoveEvent;
  getNextPlayer(card: ICard): number;
  finishGame(): any;
}

export interface IMoveEvent {
  curPlayer: number;
  nxtPlayer: number;
  card?: ICard;
  draw?: number;
  cardsToDraw?: ICard[];
  finish?: boolean;
  playersFinishingOrder?: IPlayer[];
}

export interface ICard {
  _id?: string;
  digit?: number;
  color?: "red" | "blue" | "green" | "yellow" | "black";
  action?: "reverse" | "skip" | "draw2" | "draw4" | "wild";
}
