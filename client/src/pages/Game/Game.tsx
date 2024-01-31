//import DrawingStack from "./jsx/DrawingStack.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Player } from "../../utils/interfaces.ts";
import { useAppSelector } from "../../hooks/hooks.ts";
import API from "../../api/API.ts";
import {moveCard, movePlayer, stopGame, moveFirstCard, movePlayerSelectableCard} from "../../reducers.ts";
import TableStack from "./jsx/TableStack.jsx";
import TopStack from "./jsx/TopStack.jsx";
import PlayerStack from "./jsx/PlayerStack.jsx";
import DrawingStack from "./jsx/DrawingStack.jsx";
import RightStack from "./jsx/RightStack.jsx";
import LeftStack from "./jsx/LeftStack.jsx";
import { Navigate } from "react-router-dom";
import Ranking from "./jsx/Ranking.tsx";
import Chat from "../../components/chat/Chat.tsx";
//import {Navigate} from "react-router-dom";

const Game = () => {
    const dispatch = useDispatch();

    const [finished, setFinished] = useState(false);
    const [playersOrder, setPlayersOrder] = useState<Player[]>([]);
    const inGame = useAppSelector(state => state.game.inGame);
    //const [modal, showModal] = useState(false)

    const firstCard = useAppSelector(state => state.game.firstCard);
    const firstPlayer = useAppSelector(state => state.game.firstPlayer);

    dispatch(moveFirstCard({ nextPlayer: firstPlayer, card: firstCard }));
    setTimeout(() => dispatch(movePlayer()), 500);

    useEffect(() => {
        const timeoutReady = setTimeout(() => {
            API.emitReady();
        }, 2000);

        API.onMove(({ card, draw, cardsToDraw, nxtPlayer }) => {
            //console.info("GAME draw: ", draw);
            dispatch(moveCard({ nextPlayer: nxtPlayer, card, draw, cardsToDraw }));
            setTimeout(() => dispatch(movePlayer()), 500);
        });

        API.onMoveSelectableColorCard(({ card, draw, cardsToDraw, colorSelected, nxtPlayer }) => {
            dispatch(moveCard({ nextPlayer: nxtPlayer, card, draw, cardsToDraw }));
            setTimeout(() => dispatch(movePlayerSelectableCard({color: colorSelected})), 500);
        });

        API.onFinishGame((players: Player[]) => {
            setFinished(true);
            setPlayersOrder(players);
        });

        return () => {
            API.leaveServer();
            dispatch(stopGame());
            clearTimeout(timeoutReady);
        }

    }, [dispatch]);

    if (!inGame) {
        console.info("Not in game: ", inGame);
        return <Navigate replace to="/home" />;
    }

    return (
        /*            {players === undefined || players.length < 2 ?
                        <Result
                            status="warning"
                            title="This room do not exist anymore."
                            extra={
                                <Button type="primary" key="console" onClick={() => navigate("/home")}>
                                    Go to the homepage
                                </Button>
                            }
                        />
                        :*/
        <div>
            {/*<Row justify="space-between" style={{ marginBottom: 22 }}>*/}
            {/*    <Button type="primary" onClick={() => showModal(true)} icon={<LeftOutlined />}> Back</Button>*/}
            {/*    <p>You are: {socket?.id}</p>*/}
            {/*</Row>*/}

            {finished ? <Ranking playersOrder={playersOrder} /> : (
                <>
                    <Chat />
                    <TableStack />
                    <TopStack />
                    <LeftStack />
                    <RightStack />
                    <PlayerStack />
                    <DrawingStack />
                </>
            )}

            {/*<Modal open={modal} title="Are you sure to leave the lobby?"*/}
            {/*       onOk={() => leaveRoom(socket, state?.roomName, true, navigate)}*/}
            {/*       onCancel={() => showModal(false)}*/}
            {/*/>*/}
        </div>
    );
}

export default Game