import styled from "styled-components";
import { useAppSelector} from "../../../hooks/hooks.ts";
import CardsRow from "../../../components/jsx/CardsRow.jsx";

const Root = styled.div`
  position: fixed;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  --cardWidth: var(--cardWidthBigger);
`;

export default function PlayerStack() {
  const { player, currentPlayer } = useAppSelector((state) => ({
    player: state.game.players[0],
    currentPlayer: state.game.currentPlayer,
  }));
  const cards = player?.cards || [];

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
