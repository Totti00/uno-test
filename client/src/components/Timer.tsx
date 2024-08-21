import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../hooks/hooks";
import { setColorSelection } from "../reducers";
import { useDispatch } from "react-redux";
import API from "../api/API";
import { playerAndCurrPlayerStackSelector } from "../pages/Game/MemorizedSelector";

const Timer: React.FC = () => {
    const divStyle: React.CSSProperties = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid black',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'larger',
        textAlign: 'center',
        borderRadius: '10px',
    };

    const dispatch = useDispatch();

    const { currentPlayer } = useAppSelector(playerAndCurrPlayerStackSelector);

    const [time, setTime] = useState<number>(0);
    const [showTimer, setShowTimer] = useState<boolean>(false);

    const listenersAdded = useRef<boolean>(false);

    useEffect(() => {
        if (!listenersAdded.current) {
            const handleResetTimer = (moveTime: number) => {
                console.info("timer resetted with " + moveTime + " seconds");
                setTime(moveTime);
                setShowTimer(true);
            };

            const handleTimeOut = () => {
                console.info("Time out! drawing card...");
                dispatch(setColorSelection({ colorSelection: false }));
                API.move(true, "");
                setTimeout(() => {
                    API.PASS();
                }, 500);
            };

            API.onResetTimer(handleResetTimer);
            API.onTimeOut(handleTimeOut);

            listenersAdded.current = true;
        }

    }, [currentPlayer, dispatch]);

    useEffect(() => {
        if (time === 0) return; // can't go under 0, timeOut event managed by the server

        const timerId = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [time]);

    return (
        showTimer && (
            <div style={divStyle}>
                Time left:<br />
                {time}
            </div>
        )
    );
};

export default Timer;