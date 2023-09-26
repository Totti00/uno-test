const { wrapMod, shuffle } = require("./helpers.cjs");
const { nanoid } = require("nanoid");
const {getCards} = require("./Cards.cjs");

class GameServer {
  serverId;
  serverName;

  players = [];
  curPlayer = 0;
  direction = 1;
  tableStk = [];
  drawingStk = [];
  sumDrawing = 0;
  lastPlayerDrew = false;
  playersFinished = [];
  gameRunning = false;
  deck = null;

  constructor(serverName, numberOfPlayers = 4) {
    this.serverId = nanoid();
    this.serverName = serverName;
    this.numberOfPlayers = numberOfPlayers;
  }

  async init() {
    this.players = [];
    this.curPlayer = 0;
    this.direction = 1;
    this.tableStk = [];
    this.drawingStk = [];
    this.sumDrawing = 0;
    this.playersFinished = [];
    this.lastPlayerDrew = false;
    this.gameRunning = false;
    this.deck = await getCards();  //async/await per eliminare la promise ed aspettare il risultato.
  }

  joinPlayer(player) {
    const playerId = nanoid();

    this.players.push({
      ...player,
      id: playerId,
      cards: [],
    });
    return playerId;
  }

  leavePlayer(playerId) {
    if (!this.gameRunning) {
      this.players = this.players.filter((p) => p.id !== playerId);
    } else {
      const player = this.players.find((p) => p.id === playerId);
      player.disconnected = true;
    }
  }

  start() {
    //console.info("GameServer.cjs: ", this.deck);
    shuffle(this.deck);
    shuffle(this.players);

    const NUM_CARDS = 7;
    this.players.forEach((player, idx) => {
      player.cards = this.deck.slice(idx * NUM_CARDS, (idx + 1) * NUM_CARDS);
    });
    this.drawingStk = this.deck.slice(
      this.players.length * NUM_CARDS,
        this.deck.length
    );
  }

  move(draw, card) {
    let moveEventObj = { nxtPlayer: 0, curPlayer: 0 };

    //controllo che la carta può essere giocata sulla cima dello stack
    if (card && !canPlayCard(this.tableStk[0], card, this.lastPlayerDrew))
      return false;

    if (draw) {
      let drawCnt = 1;
      if (this.sumDrawing) {
        drawCnt = this.sumDrawing;
        this.sumDrawing = 0;
      }

      moveEventObj.draw = drawCnt;
      if (drawCnt + 1 > this.drawingStk.length) {
        this.drawingStk = shuffle(this.tableStk.slice(5, this.tableStk.length));
        this.tableStk = this.tableStk.slice(0, 5);
      }

      moveEventObj.cardsToDraw = this.drawingStk.slice(0, drawCnt);
      this.players[this.curPlayer].cards = this.drawingStk
        .slice(0, drawCnt)
        .concat(this.players[this.curPlayer].cards);

      this.drawingStk = this.drawingStk.slice(drawCnt, this.drawingStk.length);
      this.lastPlayerDrew = true;
    }

    let nxtPlayer = this.getNextPlayer(card);

    moveEventObj.curPlayer = this.curPlayer;
    moveEventObj.nxtPlayer = nxtPlayer;

    if (card) {
      if (card.action === "draw2") this.sumDrawing += 2;
      if (card.action === "draw4") this.sumDrawing += 4;

      this.tableStk.unshift(card); //Inserisce la carta in cima allo stack
      moveEventObj.card = card;
      this.players[this.curPlayer].cards = this.players[
        this.curPlayer
      ].cards.filter((c) => c.id !== card._id); //rimuove dalla mano del giocatore, la carta appena giocata
      this.lastPlayerDrew = false;

      // Check if game finished
      if (this.players[this.curPlayer].cards.length === 0)  
        this.playersFinished.push(this.curPlayer);
      if (this.playersFinished.length === this.players.length - 1)
        this.finishGame();
    }

    this.curPlayer = nxtPlayer;
    return moveEventObj;
  }

  getNextPlayer(card) {
    let nxtPlayer = this.curPlayer;

    if (card?.action === "reverse") this.direction *= -1;

    //Move to next player ( if not wild card )
    if (card?.action === "skip")
      nxtPlayer = wrapMod(
        this.curPlayer + 2 * this.direction,
        this.players.length
      );
    else if (card?.action !== "wild")
      nxtPlayer = wrapMod(
        this.curPlayer + this.direction,  //this.curPlayer + 1 * this.direction,
        this.players.length
      );

    //if nxtPlayer is out of the game (no cards left with him)
    while (this.players[nxtPlayer].cards.length === 0) {
      nxtPlayer = wrapMod(nxtPlayer + this.direction, this.players.length); //this.curPlayer + 1 * this.direction,
    }

    return nxtPlayer;
  }

  onFinish(cb) {
    this.onFinish = cb;
  }

  finishGame() {
    const lastPlayer = this.players.filter(
      (player) =>
        !this.playersFinished.some(
          (playerFinished) => playerFinished.id === player.id
        )
    );
    this.playersFinished.push(lastPlayer.id);
    const playersFinishingOrder = this.playersFinished.map(
      (idx) => this.players[idx]
    );

    this.init();

    this.onFinish(playersFinishingOrder);
  }
}

function canPlayCard(oldCard, newCard, lastPlayerDrew) {
  const isOldDawingCard =
    oldCard?.action && oldCard.action.indexOf("draw") !== -1;
  const haveToDraw = isOldDawingCard && !lastPlayerDrew;
  const isNewDawingCard =
    newCard?.action && newCard.action.indexOf("draw") !== -1;

  //No Card Played Yet
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

module.exports = GameServer;