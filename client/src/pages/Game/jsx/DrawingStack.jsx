import styled from "styled-components";
import Card from "../../../components/jsx/Card.jsx";
import FrontCards from "./FrontCards.jsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks.ts";
import { ready } from "../../../reducers.ts";
import API from "../../../api/API.ts";
import {drawingStackAndCurrentPlayerSelector} from "./MemorizedSelector.ts";

const variants = {
  init: { x: 0, y: 0 },
  idleCenter: { x: "calc(50vw - 50%)", y: "calc(-1 * 50vh + 50% )" },
  idleCorner: { x: "10px", y: "70px" },
  idleCornerDisabled: { x: "10px", y: "80%", transition: { duration: 1 } },

  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const Root = styled.div`
  --cardWidth: var(--cardWidthBigger);

  position: fixed;
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);

  width: var(--cardWidth);
  height: calc(var(--cardWidth) * 1.41);
  z-index: 10;

  cursor: ${(props) => (props.canHover ? "pointer" : "initial")};
  filter: ${(props) =>
    !props.highlight ? "contrast(.5)" : "drop-shadow(0 0 10px white)"};

  .card-container {
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;

export default function DrawingStack() {
  const { drawingStack, currentPlayer } = useAppSelector(drawingStackAndCurrentPlayerSelector);
  // const { drawingStack, currentPlayer } = useAppSelector((state) => ({
  //   drawingStack: state.game.drawingStack,
  //   currentPlayer: state.game.currentPlayer,
  // }));
  // console.info("drawingstack", drawingStack);
  const dispatch = useAppDispatch();

  const [gameStarted, setGameStarted] = useState(false);

  const handleClick = () => {
    if (currentPlayer === 0) API.move(true);
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(ready());
      setGameStarted(true);
    }, 2000);
  }, [dispatch]);

  const canHover = gameStarted && currentPlayer === 0;
  const highlight = canHover || !gameStarted;

  return (
    <Root
      as={motion.div}
      onClick={handleClick}
      canHover={canHover}
      highlight={highlight}
      gameStarted={gameStarted}
      variants={variants}
      initial="init"
      animate={
        gameStarted
          ? canHover
            ? "idleCorner"
            : "idleCornerDisabled"
          : "idleCenter"
      }
      whileHover={canHover ? "hover" : { scale: 1 }}
    >
      {drawingStack.map((card) => (
        <div className="card-container" key={card.layoutId}>
          <Card
            layoutId={card.layoutId}
            color={card.color}
            digit={card.digit}
            action={card.action}
            width={200}
            disableShadow={true}
          />
        </div>
      ))}
      <FrontCards />
    </Root>
  );
}
