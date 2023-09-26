import styled from "styled-components";
import { useAppSelector} from "../../../hooks/hooks.ts";
import CardsRow from "../../../components/jsx/CardsRow.jsx";
import {useMemo} from "react";
import {playerAndCurrPlayerStackSelector} from "./MemorizedSelector.ts";

const Root = styled.div`
  position: fixed;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  --cardWidth: var(--cardWidthBigger);
`;

export default function PlayerStack() {

  const { player, currentPlayer } = useAppSelector(playerAndCurrPlayerStackSelector);
  const cards = useMemo(() => player?.cards || [], [player]);

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
