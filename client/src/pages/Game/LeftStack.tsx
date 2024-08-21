import styled from "styled-components";
import { useAppSelector } from "../../hooks/hooks";
import CardsColumn from "../../components/CardsColumn";
import { useMemo } from "react";
import { playerAndCurrPlayerLeftStackSelector } from "./MemorizedSelector";
import { Card } from "../../utils/interfaces";

const Root = styled.div`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export default function LeftStack() {
  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerLeftStackSelector);
  const cards: Card[] = useMemo(() => player?.cards || [], [player]);

  return (
    <Root>
      <CardsColumn cards={cards} highlight={currentPlayer === 1} />
    </Root>
  );
}