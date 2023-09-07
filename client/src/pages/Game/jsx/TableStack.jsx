import styled from "styled-components";
import Card from "../../../components/jsx/Card.jsx";
import { useAppSelector } from "../../../hooks/hooks.ts";

const Root = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  --cardWidth: var(--cardWidthBigger);

  .card-container {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
`;

export default function TableStack() {
  const tableStack = useAppSelector((state) => state.game.tableStack);

  return (
    <Root>
      {tableStack.map((card) => (
        <div className="card-container" key={card.layoutId}>
          <Card
            layoutId={card.layoutId}
            color={card.color}
            digit={card.digit}
            action={card.action}
            width={200}
            flip={card.flip}
            rotationY={card.rotationY}
          />
        </div>
      ))}
    </Root>
  );
}
