import { Button, Input, Row, App } from "antd"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import socketContext from "../../context/SocketContext";
import { LeftOutlined } from "@ant-design/icons";
import { createRoom } from "../../hooks/functions";

const CreateLobby = () => {
    const { socket } = useContext(socketContext).socketState;
    const [roomName, setRoomName] = useState<string>("")
    const navigate = useNavigate()

    const handleCreateServer = async () => {
        createRoom(socket, roomName, navigate);
        //const playerId = await createServer(roomName);
        //dispatch(setPlayerId(playerId));
        //dispatch(setInLobby(true));
    };

    return (
        <App>
            <Button style={{ margin: 20 }} icon={<LeftOutlined />} type="primary" onClick={() => navigate(-1)}>Back</Button>
            <Row justify="center" align="middle" style={{ position: "absolute", top: "40%", width: "100%" }}>
                <Input autoFocus style={{ textAlign: "center", height: 100, margin: 30, border: "none", fontSize: 22 }} size="large" placeholder="Insert a lobby name" onChange={(value) => setRoomName(value.target.value)}/>
                <Row justify="end">
                    {/*<Button style={{ width: 200 }} type="primary" size="large" onClick={() => createRoom(socket, roomName, navigate)} >Create Lobby</Button>*/}
                    <Button style={{ width: 200 }} type="primary" size="large" onClick={handleCreateServer} >Create Lobby</Button>
                </Row>
            </Row >
        </App>
    )
}
export default CreateLobby