import styled from "styled-components";
import Card from "../Card";

const Root = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  filter: ${(props) =>
          props.highlight ? "drop-shadow(0 0 10px white)" : "brightness(0.6)"};

  --cardHeight: calc(1.41 * var(--cardWidth));
  --cardsCnt: ${(props) => props.cardsCnt};
  --containerMaxHeight: 50vh;
  .card-container {
    &:not(:last-of-type) {
      margin-bottom: calc(
              -1 * max(calc((
              var(--cardHeight) * var(--cardsCnt) -
              var(--containerMaxHeight)
              ) / (var(--cardsCnt) - 1)), calc(var(--cardHeight) / 2))
      );
    }
  }
`;

const StyledRoot = styled(Root)`
  ${(props) => (props.shouldForwardProp ? props.shouldForwardProp : "")};
`;

//sto utilizzando la prop "as" in StyledRoot per specificare il tipo di elemento HTML da usare per il componente "styled-components"
// e passo la prop "highlight" solo se è supportata da quell'elemento HTML specifico.
//Quindi sto assegnando l'elemento HTML "div" a StyledRoot utilizzando la prop "as", e passo la prop "highlight" 
//solo se "shouldForwardProp" è true.
export default function CardsColumn({ cards, highlight, shouldForwardProp}) {
    return (
        <StyledRoot as="div" style={{'--cardsCnt':cards.length}} {...(shouldForwardProp ? { highlight: highlight } : {})}>
            {cards.map((card) => (
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
        </StyledRoot>
    );
}
