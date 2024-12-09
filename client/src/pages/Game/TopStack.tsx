import {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import { useAppSelector } from "../../hooks/hooks";
import CardsRow from "../../components/CardsRow.tsx";
import { playerAndCurrPlayerStackSelector } from "./MemorizedSelector";
import { Card } from "../../utils/interfaces";
import {getSecondNextPlayerName} from "./PlayersNameOnGame.ts";

const Root = styled.div`
    position: fixed;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
`;

const PlayerName = styled.div`
    position: absolute; /* Sovrappone il nome alle carte */
    left: 80%; /* Centra orizzontalmente rispetto alla colonna */
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
    margin-top: 19%;
`;


export default function TopStack() {
    const { players, currentPlayer } = useAppSelector(playerAndCurrPlayerStackSelector);
    const player = players[2];
    const cards: Card[] = useMemo(() => player?.cards || [], [player]);
    const [playerName, setPlayerName] = useState<string>("");

    useEffect(() => {
        if (players) {
          const nextPlayer = getSecondNextPlayerName(players); // Passa l'array dei giocatori
          setPlayerName(nextPlayer);
        }
    }, [players]);

    return (
        <Root>
            <PlayerName>{playerName}</PlayerName>
            <CardsRow cards={cards} highlight={currentPlayer === 2} />
        </Root>
    );
}