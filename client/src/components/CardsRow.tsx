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
  --containerMaxWidth: clamp(60vw, 80vw, 100vw);
  --cardMaxWidth: 130px;
  
  width: 100%;
  max-width: var(--containerMaxWidth);

  .card-container {
    flex: 1 1 auto;

    /* Apply scaling only if more than 10 cards */
    max-width: ${(props) =>
      props.$cardsCnt > 10
        ? `calc(var(--cardMaxWidth) * (11 / var(--cardsCnt)))`
        : "var(--cardMaxWidth)"};

    transition: max-width 0.1s ease;
  }
`;

export default function CardsRow({ cards, cardProps, highlight }: Readonly<CardsRowProps>) {

  const sortedCards = [...cards].sort((a, b) => Number(a._id) - Number(b._id));

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