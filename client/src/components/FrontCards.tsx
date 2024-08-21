import React from "react";
import Card from "./Card";
import { v4 as uuidv4 } from "uuid";

// Funzione per generare numeri casuali sicuri
function getRandomNumber(min: number, max: number): number {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0] / (0xffffffff + 1);
  return Math.floor(randomNumber * (max - min + 1)) + min;
}

const FrontCards: React.FC = React.memo(function () {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_) => (
          <div
            className="card-container"
            key={uuidv4()} //it was key={idx} before
            style={{
              transform: `translate(${getRandomNumber(-10, 10)}px, ${getRandomNumber(-10, 10)}px)`,
            }}
          >
            <Card />
          </div>
        ))}
    </>
  );
});

export default FrontCards;