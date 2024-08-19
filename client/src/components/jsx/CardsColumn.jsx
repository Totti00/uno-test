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

// I am using the "as" prop in StyledRoot to specify the type of HTML element to use for the "styled-components" component 
// and passing the "highlight" prop only if it is supported by that specific HTML element. 
// Therefore, I am assigning the HTML element "div" to StyledRoot using the "as" prop, and 
// passing the "highlight" prop only if "shouldForwardProp" is true.
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
