/*
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

    /!* Apply scaling only if more than 10 cards *!/
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
}*/

import styled from "styled-components";
import { motion } from "framer-motion";
import Card from "./Card";
import { Card as ICard } from "../utils/interfaces";
import { useRef, useState } from "react";

interface CardsRowProps {
    readonly cards: ICard[];
    readonly cardProps?: {
        selectable?: boolean;
    };
    readonly highlight?: boolean;
}

const Root = styled.div<{ $highlight?: boolean; $cardsCnt: number }>`
    display: flex;
    overflow: hidden;
    position: relative;
    //max-width: 100vw;
    padding: 18px;
    
    --cardsCnt: ${(props) => props.$cardsCnt};
    --containerMaxWidth: clamp(60vw, 80vw, 100vw);
    --cardMaxWidth: 130px;

    width: 100%;
    //max-width: var(--containerMaxWidth);

    filter: ${(props) => props.$highlight ? "drop-shadow(0 0 10px white)" : "brightness(0.6)"}; 
  
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

const CarouselContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
`;

export default function CardsRow({ cards, cardProps, highlight }: Readonly<CardsRowProps>) {

  const sortedCards = [...cards].sort((a, b) => Number(a._id) - Number(b._id));
  const carouselRef = useRef(null);

  // Stato per gestire la posizione attuale del carosello
  const [xPosition, setXPosition] = useState(0);

  // Stato per misurare l'offset del trascinamento e differenziare il click dal drag
  const [dragStartX, setDragStartX] = useState(0);

  return (
      <Root $highlight={highlight} $cardsCnt={cards.length}>
        <CarouselContainer
            drag="x"
            dragConstraints={carouselRef}
            ref={carouselRef}
            initial={{ x: xPosition }}
            animate={{ x: xPosition }}
            onDragStart={(_, info) => {
              setDragStartX(info.point.x); // Registra la posizione iniziale di trascinamento
            }}
            onDragEnd={(_, info) => {
              // Calcola lo spostamento complessivo
              const dragOffset = Math.abs(info.point.x - dragStartX);

              // Soglia per considerare il trascinamento come click
              const clickThreshold = 10;
              if (dragOffset < clickThreshold) {
                console.log("Rilevato come click!");
                // Aggiungi qui la logica del click
              } else {
                // Aggiorna la posizione del carosello
                setXPosition((prev) => prev + info.offset.x);
              }
            }}
            style={{ cursor: "grab" }}
        >
          {sortedCards.map((card) => (
              <motion.div
                  className="card-container"
                  key={card.layoutId}
                  style={{ minWidth: "130px" }}
                  onClick={() => console.log(`Carta cliccata: ${card._id}`)}
              >
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
              </motion.div>
          ))}
        </CarouselContainer>
      </Root>
  );
}
