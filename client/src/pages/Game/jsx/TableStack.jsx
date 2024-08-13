import styled from "styled-components";
import Card from "../../../components/Card.tsx";
import { useAppSelector } from "../../../hooks/hooks.ts";
import {tableStackSelector} from "./MemorizedSelector.ts";
import {v4 as uuidv4} from "uuid";

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
  const {tableStack} = useAppSelector(tableStackSelector);

  return (
    <Root>
      {tableStack.map((card) => (
        <div className="card-container" key={card.layoutId+"uno"}>
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
