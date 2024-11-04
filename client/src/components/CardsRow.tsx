import styled from "styled-components";
import Card from "./Card";
import { Card as ICard } from "../utils/interfaces";

interface CardsRowProps {
  readonly cards: ICard[];
  readonly cardProps?: {
    selectable?: boolean;
  };
  readonly highlight?: boolean;
}

const Root = styled.div<{ $highlight?: boolean; $cardsCnt: number }>`
  display: flex;
  justify-content: center;

  filter: ${(props) =>
    props.$highlight ? "drop-shadow(0 0 10px white)" : "brightness(0.6)"};

  --cardsCnt: ${(props) => props.$cardsCnt};
  --containerMaxWidth: 55vw;
`;

export default function CardsRow({ cards, cardProps, highlight }: Readonly<CardsRowProps>) {

  const sortedCards = [...cards].sort((a, b) => {
    // Convert _id to numbers for comparison
    return Number(a._id) - Number(b._id);
  });

  return (
    <Root $highlight={highlight} $cardsCnt={cards.length}>
      {sortedCards.map((card) => (
        <div className="card-container" key={card.layoutId}>
          <Card
            id={card._id}
            layoutId={card.layoutId}
            color={card.color}
            digit={card.digit}
            action={card.action}
            flip={card.flip}
            rotationY={card.rotationY}
            selectable={cardProps?.selectable}
            playable={card.playable}
          />
        </div>
      ))}
    </Root>
  );
}