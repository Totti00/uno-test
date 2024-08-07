import React from "react";
import Card from "../../../components/Card";
import { v4 as uuidv4 } from "uuid";

const FrontCards = React.memo(function () {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <div
            className="card-container"
            key={uuidv4()} //prima era key={idx}
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
