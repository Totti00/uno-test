import { Button, Popconfirm, Row } from "antd"
import {useContext, useEffect} from "react";
import socketContext from "../../context/SocketContext.ts";
import {useLocation, useNavigate} from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons"
import {deleteRoom, leaveRoom, fetchCards, startGame} from "../../hooks/functions"
import WhiteLobbyCard from "../../components/WhiteLobbyCard.tsx";
import {useDispatch} from "react-redux";
import {setInLobby, setPlayerId} from "../../reducers.ts";

const WaitingLobby = () => {
    const { socket, rooms } = useContext(socketContext).socketState;
    const navigate = useNavigate()
    const { state } = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCards(dispatch, rooms[state?.roomName])
        dispatch(setPlayerId(socket?.id));
        dispatch(setInLobby(true));
    }, [dispatch, navigate, rooms, socket, state?.roomName]);

    return (
        <div style={{ margin: 30 }}>
            <Row justify="space-between">
                {state?.type === "admin" ?
                    <Popconfirm
                        title="Leave room alert"
                        description="Are you sure to exit and delete this room?"
                        onConfirm={() => deleteRoom(socket, state?.roomName, navigate)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<LeftOutlined />} type="primary" >Back</Button>
                    </Popconfirm> :
                    <Button icon={<LeftOutlined />} type="primary" onClick={() => {
                        leaveRoom(socket, state?.roomName, false, navigate)
                    }}>Back</Button>
                }
            </Row>
            <Row justify="center" style={{ marginTop: 0 }}>
                <WhiteLobbyCard roomName={state?.roomName} players={rooms[state?.roomName]} />
            </Row>
            <Row justify="center" style={{ marginTop: 22 }}>
                {rooms[state?.roomName] && state?.type === "admin" && rooms[state?.roomName].length === 2 &&
                    <Button
                        onClick={() => startGame(socket, state?.roomName, navigate)}
                        //onClick = {() => fetchCards(dispatch, socket, state?.roomName, navigate, rooms[state?.roomName])}
                        style={{ width: 200 }}
                        type="primary"
                        size="large"
                    >
                        Start Game
                    </Button>
                }
            </Row>
        </div >
    )
}

export default WaitingLobby