import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Player } from "../../utils/interfaces";
import { useAppSelector } from "../../hooks/hooks";
import API from "../../api/API";
import {moveCard, finalMovePlayer, stopGame, moveFirstCard, draw2Cards, finalPlayerPass} from "../../reducers";
import TableStack from "./TableStack";
import TopStack from "./TopStack";
import PlayerStack from "./PlayerStack";
import DrawingStack from "./DrawingStack";
import RightStack from "./RightStack";
import LeftStack from "./LeftStack";
import Timer from "../../components/Timer";
import { Navigate } from "react-router-dom";
import Ranking from "./Ranking";
import Chat from "../../components/chat/Chat";
import { Modal, Row } from "antd";
import UnoButton from "../../components/UnoButton"
import PassButton from "../../components/PassButton";

const Game = () => {
    const dispatch = useDispatch();

    const [finished, setFinished] = useState(false);
    const [playersOrder, setPlayersOrder] = useState<Player[]>([]);
    const [showPlayerUpdateMessage, setShowPlayerUpdateMessage] = useState(false);
    const [showForceLeaveMessage, setShowForceLeaveMessage] = useState(false);

    const inGame = useAppSelector(state => state.game.inGame);
    const firstCard = useAppSelector(state => state.game.firstCard);
    const firstPlayer = useAppSelector(state => state.game.firstPlayer);

    useEffect(() => {
        dispatch(moveFirstCard({ nextPlayer: firstPlayer, card: firstCard }));
        setTimeout(() => dispatch(finalMovePlayer({color: ""})), 500);
    }, [dispatch, firstCard, firstPlayer]);

    useEffect(() => {
        const timeoutReady = setTimeout(() => {
            API.emitReady();
        }, 2000);

        API.onFinalPlayerPass((nxtPlayer: number) => {
            dispatch(finalPlayerPass({nxtPlayer}));
        });

        API.onMove(({ card, draw, cardsToDraw, nxtPlayer }) => {
            dispatch(moveCard({ nextPlayer: nxtPlayer, card, draw, cardsToDraw }));
            setTimeout(() => dispatch(finalMovePlayer({color: "", draw})), 500);
        });

        API.onMoveSelectableColorCard(({ card, draw, cardsToDraw, colorSelected, nxtPlayer }) => {
            dispatch(moveCard({ nextPlayer: nxtPlayer, card, draw, cardsToDraw }));
            setTimeout(() => dispatch(finalMovePlayer({color: colorSelected, draw})), 500);
        });

        API.onDraw2Cards(({lastPlayer, cardsToDrawLast}) => {
            dispatch(draw2Cards({ lastPlayer, cardsToDraw:cardsToDrawLast }));
        })

        API.onFinishGame((players: Player[]) => {
            setFinished(true);
            setPlayersOrder(players);
        });

        API.onPlayersUpdated(() => {
            setShowPlayerUpdateMessage(true);
            setTimeout(() => {
                setShowPlayerUpdateMessage(false);
                API.leaveServer();
                dispatch(stopGame());
            }, 5000);
        });

        API.onForceLeave(() => {
            setShowForceLeaveMessage(true);
            setTimeout(() => {
                setShowForceLeaveMessage(false);
                API.leaveServer();
                dispatch(stopGame());
            }, 1000);
        })

        return () => {
            API.leaveServer();
            dispatch(stopGame());
            clearTimeout(timeoutReady);
        }

    }, [dispatch]);

    if (!inGame) {
        console.log("Error! not in game");
        return <Navigate replace to="/home" />;
    }

    return (
        <div>
            <Modal open={showPlayerUpdateMessage} title="The number of players has changed. Redirecting to home in 5 seconds..."
                footer={null} />

            <Modal open={showForceLeaveMessage} title="Too many time out, player is being disconnected"
                footer={null} />

            <div style={{ margin: 10 }}>
                <Row justify="end">
                    <Chat />
                </Row>
            </div>
            

            {finished ? <Ranking playersOrder={playersOrder} setFinished={setFinished}/> : (
                <>
                    <Timer/>
                    <TableStack />
                    <TopStack />
                    <LeftStack />
                    <RightStack />
                    <PlayerStack />
                    <DrawingStack />
                    <UnoButton />
                    <PassButton />
                </>
            )}
        </div>
    );
}

export default Game