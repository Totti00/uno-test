import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../utils/loader";
import {useNavigate} from "react-router-dom";

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  h2 {
    text-align: center;
    margin-bottom: 36px;
    font-size: 10vmin;
  }

  p {
    font-size: 5vmin;
    text-shadow: 0 0 10px white;
    animation: animateText 2s infinite ease-in-out;
  }

  @keyframes animateText {
    50% {
      text-shadow: 0 0 15px white;
      transform: scale(1.05);
    }
  }
`;

interface LoadingProps {
    onLoaded: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onLoaded }) => {
    const [percentage, setPercentage] = useState<number>(3);
    const [completed, setCompleted] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleProgress = (value: number) => {
            setPercentage(Math.round(100 * value));
        }

        const handleCompleted = () => {
            setCompleted(true);
        }

        Loader.load();
        Loader.addEventListener("progress", handleProgress);

        Loader.addEventListener("completed", handleCompleted);

        return () => {
            Loader.removeEventListener("progress", handleProgress);
            Loader.removeEventListener("completed", handleCompleted);
        }
    }, [onLoaded, navigate]);

    const onClick = () => {
        if (completed) {
            onLoaded();
            navigate("/");
        }
    };

    return (
        <Root onClick={onClick}>
            {completed ? (
                <>
                    <h2>Ready!!</h2>
                    <p>Click Anywhere to Start</p>
                </>
            ) : (
                <>
                    <h2>Loading Game Assets...</h2>
                    <p>{percentage}%</p>
                </>
            )}
        </Root>
    );
};

export default Loading;