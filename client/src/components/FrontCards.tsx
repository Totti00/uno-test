import React from "react";
import Card from "./Card";
import { v4 as uuidv4 } from "uuid";

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
              transform: `translate(${Math.random() * 20 - 10}px,${
                Math.random() * 20 - 10
              }px)`,
            }}
          >
            <Card />
          </div>
        ))}
    </>
  );
});

export default FrontCards;