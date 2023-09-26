import styled from "styled-components";
import { useAppSelector } from "../../../hooks/hooks.ts";
import CardsColumn from "../../../components/jsx/CardsColumn.jsx";
import {useMemo} from "react";
import {playerAndCurrPlayerLeftStackSelector} from "./MemorizedSelector.ts";

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export default function LeftStack() {
  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerLeftStackSelector);
  const cards = useMemo(() => player?.cards || [], [player]);

  return (
    <Root>
      <CardsColumn cards={cards} highlight={currentPlayer === 1} />
    </Root>
  );
}