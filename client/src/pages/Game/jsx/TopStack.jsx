import styled from "styled-components";
import { useAppSelector } from "../../../hooks/hooks";
import CardsRow from "../../../components/jsx/CardsRow";
import {playerAndCurrPlayerTopStackSelector} from "./MemorizedSelector.ts";
import {useMemo} from "react";

const Root = styled.div`
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
`;

export default function TopStack() {
  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerTopStackSelector);
  const cards = useMemo(() => player?.cards || [], [player]);


  // const { player, currentPlayer } = useAppSelector((state) => ({
  //   player: state.game.players[2],
  //   currentPlayer: state.game.currentPlayer,
  // }));

  return (
    <Root>
      <CardsRow cards={cards} highlight={currentPlayer === 2} />
    </Root>
  );
}
