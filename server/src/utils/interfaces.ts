export interface IPlayer {
  id: string;
  name: string;
  seed: string;
  socketID: string;
  cards: ICard[];
  disconnected: boolean;
  timeOutCount: number;
  isMaster: boolean;
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
  lastPlayerUNO: boolean;
  lastPlayer: number;

  init(): Promise<void>;
  joinPlayer(player: IPlayer): string;
  leavePlayer(playerId: string): void;
  start(): any;
  restart(): Promise<void>;
  chat(message: string): any;
  getChat(): any;
  move(draw: boolean, card: ICard /* | null */): IMoveEvent;
  getNextPlayer(card: ICard): number;
  finishGame(): any;
  resetTimer(timeoutSeconds: number, nxtPlayer: number, handleTimeOut: ({ nxtPlayer, serverId }: { nxtPlayer: number; serverId: string; }, io: any) => void, io: any):any;
  playerDraw2(playerIndex: number): ICard[];
}

export interface IMoveEvent {
  curPlayer: number;
  nxtPlayer: number;
  card?: ICard;
  draw?: number;
  cardsToDraw?: ICard[];
  finish?: boolean;
  playersFinishingOrder?: IPlayer[];
  oneCardLeft?: boolean;
  lastPlayer: number;
}

export interface ICard {
  _id?: string;
  digit?: number;
  color?: "red" | "blue" | "green" | "yellow" | "black";
  action?: "reverse" | "skip" | "draw2" | "draw4" | "wild";
}
