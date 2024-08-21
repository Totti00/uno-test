import styled from "styled-components";
import Card from "../../components/Card";
import { useAppSelector } from "../../hooks/hooks";
import { tableStackSelector } from "./MemorizedSelector";
import { Card as ICard } from "../../utils/interfaces";

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
  const { tableStack } = useAppSelector(tableStackSelector);

  return (
    <Root>
      {tableStack.map((card: ICard) => (
        <div className="card-container" key={card.layoutId + "uno"}>
          <Card
            layoutId={card.layoutId}
            color={card.color}
            digit={card.digit}
            action={card.action}
            flip={card.flip}
            rotationY={card.rotationY}
          />
        </div>
      ))}
    </Root>
  );
}