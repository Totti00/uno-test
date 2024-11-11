import { useMemo } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../hooks/hooks";
import CardsRow from "../../components/CardsRow.tsx";
import { playerAndCurrPlayerTopStackSelector } from "./MemorizedSelector";
import { Card } from "../../utils/interfaces";

const Root = styled.div`
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
`;

export default function TopStack() {
  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerTopStackSelector);
  const cards: Card[] = useMemo(() => player?.cards || [], [player]);

  return (
    <Root>
      <CardsRow cards={cards} highlight={currentPlayer === 2} />
    </Root>
  );
}