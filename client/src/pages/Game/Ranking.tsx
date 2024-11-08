import { Button, Modal, Row } from 'antd';
import { useNavigate } from "react-router-dom";
import { Player } from '../../utils/interfaces.ts';
import WhiteRankingCard from '../../components/WhiteRankingCard.tsx';
import React, { useEffect, useState } from "react";
import {init, setFirstCard, initGame} from "../../reducers.ts";
import {useDispatch} from "react-redux";
import API from '../../api/API.ts';

interface RankingProps {
    playersOrder: Player[];
    setFinished: (finished: boolean) => void;
}

const Ranking: React.FC<RankingProps> = ({ playersOrder, setFinished }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isMaster, setIsMaster] = useState(false);
    const [showInitGameMessage, setShowInitGameMessage] = useState(false);

    useEffect(() => {
        let unsubInit: (() => void) | null = null;
        let timeout: string | number | NodeJS.Timeout | null | undefined = null;

        const checkIfPlayerIsMaster = async () => {
            const result = await API.isPlayerMaster();
            setIsMaster(result);
        };

        checkIfPlayerIsMaster();

        unsubInit = API.onGameInit(({ players, cards, card, nxtPlayer }) => {
            dispatch(setFirstCard({ firstCard: card, firstPlayer: nxtPlayer }));
            dispatch(init({ cards, players }));
            dispatch(initGame());
            setFinished(false);
            setShowInitGameMessage(false);
        });

        return () => {
            if (timeout) clearTimeout(timeout);
            if (unsubInit) unsubInit();
        };
        
    }, []);

    const handleLeaveServer = async () => {
        navigate("/home");
    };

    const handlePlayAgain = async () => {
        setShowInitGameMessage(true);
        await API.playAgain();
    };

    return (
        <div style={{ margin: 30 }}>
            <Modal open={showInitGameMessage} title="The game will start in a few seconds !"
                footer={null} />
                
            <Row justify="center" style={{ marginTop: 0 }}>
                <WhiteRankingCard players={playersOrder} />
            </Row>
            
            <Row align="middle" gutter={[0, 16]} justify="space-between" style={{ position: "absolute", bottom: "5%", width: "50%", textAlign: "center", left: 0, right: 0, marginLeft: "auto", marginRight: "auto" }}
            >
                {isMaster && (<Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={handlePlayAgain}> 
                    Play again
                </Button>)}

                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={handleLeaveServer}>Home</Button>
            </Row>

        </div >
    )
}

export default Ranking;