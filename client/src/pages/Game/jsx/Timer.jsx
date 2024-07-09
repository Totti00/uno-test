import styled from "styled-components";
import {Row} from "antd";
import {LeftOutlined} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks.ts";
import { ready } from "../../../reducers.ts";
import API from "../../../api/API.ts";
import {playerAndCurrPlayerStackSelector} from "./MemorizedSelector.ts";

const Timer = () => {
    const divStyle = {
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

    const { currentPlayer } = useAppSelector(playerAndCurrPlayerStackSelector);
    const [time, setTime] = useState(0);
    const [showTimer, setShowTimer] = useState(false);

    useEffect(() => {
        API.onResetTimer((moveTime) => {
            console.info("timer resetted with " + moveTime + " seconds");
            setTime(moveTime);
            setShowTimer(true);
        });

        //se il client va giù può richiederlo
        // API.getTimer(({timeLeft}) => {
        //     setTime(timeLeft);
        // });

        API.onTimeOut(() => {
            if(currentPlayer === 0){
                console.info("Time out! drawing card...");
                API.move(true);
            }
        });
    });
  
    useEffect(() => {
      if (time === 0) return; //can't go under 0, timeOut event managed by the server
  
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