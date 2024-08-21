import { useMemo } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../hooks/hooks";
import CardsColumn from "../../components/CardsColumn";
import { playerAndCurrPlayerRightStackSelector } from "./MemorizedSelector";
import { Card } from "../../utils/interfaces";

const Root = styled.div`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export default function RightStack() {
  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerRightStackSelector);
  const cards: Card[] = useMemo(() => player?.cards || [], [player]);

  return (
    <Root>
      <CardsColumn cards={cards} highlight={currentPlayer === 3} />
    </Root>
  );
}