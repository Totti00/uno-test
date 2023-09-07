import styled from "styled-components";
import { useAppSelector } from "../../../hooks/hooks";
import CardsRow from "../../../components/jsx/CardsRow";

const Root = styled.div`
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
`;

export default function TopStack() {
  const { player, currentPlayer } = useAppSelector((state) => ({
    player: state.game.players[1],
    currentPlayer: state.game.currentPlayer,
  }));

  const cards = player?.cards || [];

  return (
    <Root>
      <CardsRow cards={cards} highlight={currentPlayer === 2} />
    </Root>
  );
}
