import { useMemo } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../hooks/hooks";
import CardsRow from "../../components/CardsRow";
import { playerAndCurrPlayerStackSelector } from "./MemorizedSelector";
import { Card } from "../../utils/interfaces";

const Root = styled.div`
  position: fixed;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  --cardWidth: var(--cardWidthBigger);
`;

export default function PlayerStack() {
  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerStackSelector);
  const cards: Card[] = useMemo(() => player?.cards || [], [player]);

  return (
    <Root>
      <CardsRow
        cards={cards}
        highlight={currentPlayer === 0}
        cardProps={{ selectable: true }}
      />
    </Root>
  );
}