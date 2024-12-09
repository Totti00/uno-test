import {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import { useAppSelector } from "../../hooks/hooks";
import CardsColumn from "../../components/CardsColumn";
import {playerAndCurrPlayerStackSelector} from "./MemorizedSelector";
import { Card } from "../../utils/interfaces";
import {getThirdNextPlayerName} from "./PlayersNameOnGame.ts";

const Root = styled.div`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding-left: 25%;
`;

const PlayerName = styled.div`
  position: absolute; /* Sovrappone il nome alle carte */
  left: 50%; /* Centra orizzontalmente rispetto alla colonna */
  top: 50%; /* Centra verticalmente rispetto alla colonna */
  transform: translate(-50%, -50%); /* Centra esattamente il nome */
  background-color: rgba(0, 0, 0, 0.7); /* Sfondo semitrasparente */
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  z-index: 1; /* Assicura che sia sopra le carte */
`;

export default function RightStack() {
  const { players, currentPlayer } = useAppSelector(playerAndCurrPlayerStackSelector);
  const player = players[3];
  const cards: Card[] = useMemo(() => player?.cards || [], [player]);
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    if (players) {
      const nextPlayer = getThirdNextPlayerName(players); // Passa l'array dei giocatori
      setPlayerName(nextPlayer);
    }
  }, [players]);

  return (
    <Root>
      <PlayerName>{playerName}</PlayerName>
      <CardsColumn cards={cards} highlight={currentPlayer === 3} />
    </Root>
  );
}