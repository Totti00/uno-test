import React from "react";
import Card from "../../../components/jsx/Card.jsx";

const FrontCards = React.memo(function () {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <div
            className="card-container"
            key={idx}
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
