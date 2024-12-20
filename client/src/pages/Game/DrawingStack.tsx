import styled from "styled-components";
import Card from "../../components/Card";
import FrontCards from "../../components/FrontCards";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ready } from "../../reducers";
import API from "../../api/API";
import { drawingStackAndCurrentPlayerSelector } from "./MemorizedSelector";
import { Card as ICard } from "../../utils/interfaces";

const variants = {
  init: { x: 0, y: 0 },
  idleCenter: { x: "calc(50vw - 50%)", y: "calc(-1 * 50vh + 50% )" },
  idleCorner: { x: "10px", y: "70px" },
  idleCornerDisabled: { x: "10px", y: "80%", transition: { duration: 1 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const Root = styled(motion.div)<{ canHover: boolean; highlight: boolean }>`
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
  const colorSelection = useAppSelector((state) => state.game.colorSelection);
  const alreadyDrawn = useAppSelector((state) => state.game.alreadyDrawn);

  const dispatch = useAppDispatch();

  const [gameStarted, setGameStarted] = useState(false);

  const handleClick = () => {
    if (currentPlayer === 0 && !colorSelection && !alreadyDrawn) API.move(true, "");
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(ready());
      setGameStarted(true);
    }, 2000);
  }, [dispatch]);

  const canHover = gameStarted && currentPlayer === 0 && !colorSelection && !alreadyDrawn;
  const highlight = canHover || !gameStarted;

  let animationState;
  if (gameStarted) animationState = canHover ? "idleCorner" : "idleCornerDisabled";
  else animationState = "idleCenter";

  return (
    <Root
      onClick={handleClick}
      canHover={canHover}
      highlight={highlight}
      variants={variants}
      initial="init"
      animate={animationState}
      whileHover={canHover ? "hover" : { scale: 1 }}
    >
      {drawingStack.map((card: ICard) => (
        <div className="card-container" key={card.layoutId}>
          <Card
            layoutId={card.layoutId}
            color={card.color}
            digit={card.digit}
            action={card.action}
            disableShadow={true}
          />
        </div>
      ))}
      <FrontCards />
    </Root>
  );
}