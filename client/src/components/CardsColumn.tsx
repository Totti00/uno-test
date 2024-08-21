import styled from "styled-components";
import Card from "./Card";
import { Card as ICard } from "../utils/interfaces";

// Definizione delle props per il componente Root
interface RootProps {
  $highlight?: boolean;
  $cardsCnt: number;
}

// Il componente Root è stato tipizzato con l'interfaccia RootProps
const Root = styled.div.attrs<RootProps>((props) => ({
  style: {
    '--cardsCnt': props.$cardsCnt,
  } as React.CSSProperties,
}))<RootProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  filter: ${(props) =>
    props.$highlight ? "drop-shadow(0 0 10px white)" : "brightness(0.6)"};

  --cardHeight: calc(1.41 * var(--cardWidth));
  --containerMaxHeight: 50vh;

  .card-container {
    &:not(:last-of-type) {
      margin-bottom: calc(
        -1 * max(
          calc(
            (var(--cardHeight) * var(--cardsCnt) - var(--containerMaxHeight)) /
              (var(--cardsCnt) - 1)
          ),
          calc(var(--cardHeight) / 2)
        )
      );
    }
  }
`;

interface CardsColumnProps {
  readonly cards: ICard[];
  readonly highlight?: boolean;
}

export default function CardsColumn({
  cards,
  highlight = false,
}: Readonly<CardsColumnProps>) {
  return (
    <Root
      as="div"
      $cardsCnt={cards.length} // Assicurati che $cardsCnt venga passato correttamente
      $highlight={highlight}
    >
      {cards.map((card) => (
        <div className="card-container" key={card.layoutId}>
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