import styled from "styled-components";
import Image from "./Image"
import { motion } from "framer-motion";
import API from "../api/API";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setColorSelection } from "../reducers";
import { useAppSelector } from "../hooks/hooks";

interface CardProps {
  id?: string;
  color?: string;
  digit?: number;
  action?: string;
  flip?: boolean;
  rotationY?: number;
  layoutId?: string;
  selectable?: boolean;
  playable?: boolean;
  disableShadow?: boolean;
  preserve3D?: boolean;
}

const Root = styled.div<{ color?: string; disableShadow?: boolean; preserve3D?: boolean; selectable?: boolean; playable?: boolean }>`
  --color: var(--${(props) => props.color});

  .color-selector {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    position: absolute;
    border-radius: calc(var(--cardWidth) / 10);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100000;
  }

  .color-selector-item {
    cursor: pointer;
    flex-basis: 40%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .color-selector-item-inner {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid white;
  }

  padding-top: 141%;
  border-radius: calc(var(--cardWidth) / 10);
  box-shadow: ${(props) => (!props.disableShadow ? "0 0 10px #292727" : "none")};
  position: relative;
  transform-style: ${(props) => (props.preserve3D ? "preserve-3d" : "flat")};
  cursor: ${(props) => (props.playable ? "pointer" : "inherit")};
  filter: ${(props) => (props.selectable && !props.playable ? "contrast(.5)" : "none")};

  .front,
  .back {
    border-radius: calc(var(--cardWidth) / 10);
    background: whitesmoke;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    backface-visibility: hidden;
  }

  .front {
    transform: translateZ(1px);
    font-family: sans-serif;

    .value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--color);
      font-size: var(--fontBig);
      font-family: sans-serif !important;
      font-weight: bold;
      text-shadow: 5px 5px black;
      -webkit-text-stroke-color: black;
      -webkit-text-stroke-width: 2px;
    }

    .card-icon {
      width: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .value-small {
      position: absolute;
      color: white;
      -webkit-text-stroke-color: black;
      -webkit-text-stroke-width: 1.5px;
      font-weight: bold;
      font-size: var(--fontSmall);
      font-style: italic;
      font-family: sans-serif !important;

      &.value-tl {
        top: 14px;
        left: 22px;
      }

      &.value-br {
        bottom: 14px;
        right: 22px;
        transform: scale(-1);
      }

      @media screen and (max-width: 1000px) {
        -webkit-text-stroke-color: black;
        -webkit-text-stroke-width: 1px;

        .value {
          text-shadow: 3px 3px black;
        }

        &.value-tl {
          top: 9px;
          left: 13px;
        }

        &.value-br {
          bottom: 9px;
          right: 13px;
          transform: scale(-1);
        }
      }
    }

    .icon-small {
      position: absolute;
      width: 20%;

      &.icon-tl {
        top: 25px;
        left: 20px;
      }

      &.icon-br {
        bottom: 25px;
        right: 20px;
        transform: scale(-1);
      }

      @media screen and (max-width: 1000px) {
        &.icon-tl {
          top: 14px;
          left: 11px;
        }

        &.icon-br {
          bottom: 14px;
          right: 11px;
          transform: scale(-1);
        }
      }
    }
  }

  .back {
    transform: rotateY(180deg);
  }
`;

export default function Card({
  id = "",
  color = "",
  digit,
  action = "",
  flip = false,
  rotationY = 180,
  layoutId,
  selectable,
  playable,
  disableShadow = false,
  preserve3D = true,
}: CardProps) {
  const dispatch = useDispatch();

  const [showColorSelector, setShowColorSelector] = useState(false);
  const [isPreserve3D, setPreserve3D] = useState(preserve3D);

  const colorSelection = useAppSelector((state) => state.game.colorSelection);

  useEffect(() => {
    if (!colorSelection) setShowColorSelector(false);
  }, [colorSelection]);

  const onClick = () => {
    if (playable && !colorSelection) {
      if (color === "black" && (action === "wild" || action === "draw4")) {
        dispatch(setColorSelection({ colorSelection: true }));
        setShowColorSelector(true);
        setPreserve3D(false);
      } else API.move(false, id);
    }
  };

  const handleColorSelection = (selectedColor: string) => {
    setPreserve3D(true);
    dispatch(setColorSelection({ colorSelection: false }));
    API.moveSelectableColorCard(false, id, selectedColor);
  };

  const getFrontContent = () => {
    if (color === "black" && action === "wild")
      return <Image src={`assets/images/wild.png`} ratio={590 / 418} />;

    if (color === "black")
      return (
        <>
          <Image src={`assets/images/front-${color}.png`} ratio={590 / 418} />
          <img src="assets/images/draw4.png" className="card-icon" alt="" />
          <img
            className="icon-small icon-tl"
            src={`assets/images/${action}-blank.png`}
            alt=""
          />
          <img
            className="icon-small icon-br"
            src={`assets/images/${action}-blank.png`}
            alt=""
          />
        </>
      );

    if (action)
      return (
        <>
          <Image src={`assets/images/front-${color}.png`} ratio={590 / 418} />
          <img
            src={`assets/images/${action}-${color}.png`}
            className="card-icon"
            alt=""
          />
          <img
            className="icon-small icon-tl"
            src={`assets/images/${action}-blank.png`}
            alt=""
          />
          <img
            className="icon-small icon-br"
            src={`assets/images/${action}-blank.png`}
            alt=""
          />
        </>
      );
    return (
      <>
        <Image src={`assets/images/front-${color}.png`} ratio={590 / 418} />
        <p className="value">{digit}</p>
        <p className="value-small value-tl">{digit}</p>
        <p className="value-small value-br">{digit}</p>
      </>
    );
  };

  return (
    <Root
      as={motion.div}
      color={color}
      className="noselect"
      layoutId={layoutId}
      initial={{
        rotateY: flip ? Math.abs(180 - rotationY) : rotationY,
        y: showColorSelector ? -40 : 0,
      }}
      whileHover={
        playable && !colorSelection
          ? { y: -40, transition: { duration: 0.3 } }
          : { y: 0, transition: { duration: 0.3 } }
      }
      animate={{ rotateY: rotationY, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      selectable={selectable}
      playable={showColorSelector || (playable && !colorSelection)}
      disableShadow={disableShadow}
      preserve3D={isPreserve3D}
      onClick={onClick}
      role="button"
    >
      {showColorSelector && (
        <div className="color-selector">
          <div className="color-selector-item" onClick={() => handleColorSelection("red")}>
            <div className="color-selector-item-inner" style={{ backgroundColor: "red" }}></div>
          </div>
          <div className="color-selector-item" onClick={() => handleColorSelection("blue")}>
            <div className="color-selector-item-inner" style={{ backgroundColor: "blue" }}></div>
          </div>
          <div className="color-selector-item" onClick={() => handleColorSelection("green")}>
            <div className="color-selector-item-inner" style={{ backgroundColor: "green" }}></div>
          </div>
          <div className="color-selector-item" onClick={() => handleColorSelection("yellow")}>
            <div className="color-selector-item-inner" style={{ backgroundColor: "yellow" }}></div>
          </div>
        </div>
      )}
      <div className="front">{getFrontContent()}</div>
      <div className="back">
        <Image src={`assets/images/backside.png`} ratio={590 / 418} />
      </div>
    </Root>
  );
}