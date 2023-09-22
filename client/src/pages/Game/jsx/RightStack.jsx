import styled from "styled-components";
import { useAppSelector } from "../../../hooks/hooks.ts";
import CardsColumn from "../../../components/jsx/CardsColumn.jsx";
import {useMemo} from "react";
import {playerAndCurrPlayerRightStackSelector} from "./MemorizedSelector.ts";

const Root = styled.div`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export default function RightStack() {

  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerRightStackSelector);
  const cards = useMemo(() => player?.cards || [], [player]);

  // const { player, currentPlayer } = useAppSelector((state) => ({
  //   player: state.game.players[3],
  //   currentPlayer: state.game.currentPlayer,
  // }));
  // const cards = player?.cards || [];
  return (
    <Root>
      <CardsColumn cards={cards} highlight={currentPlayer === 3} />
    </Root>
  );
}
