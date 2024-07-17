import { Button, Input, Row, App } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LeftOutlined } from "@ant-design/icons";
import API from "../../api/API.ts";
import {setInLobby, setPlayerId} from "../../reducers.ts";
import {useDispatch} from "react-redux";

const CreateLobby = () => {
    const [roomName, setRoomName] = useState<string>("")
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleCreateServer = async () => {
        const playerId = await API.createServer(roomName);
        dispatch(setPlayerId(playerId));
        dispatch(setInLobby(true));
        navigate("/waiting");
    };

    return (
        <App>
            <Button style={{ margin: 20 }} icon={<LeftOutlined />} type="primary" onClick={() => navigate(-1)}>Back</Button>
            <Row justify="center" align="middle" style={{ position: "absolute", top: "40%", width: "100%" }}>
                <Input autoFocus style={{ textAlign: "center", height: 100, margin: 30, border: "none", fontSize: 22 }} size="large" placeholder="Insert a lobby name" onChange={(value) => setRoomName(value.target.value)}/>
                <Row justify="end">
                    {roomName && roomName.trim().length > 1 && 
                        <Button style={{ width: 200 }} type="primary" size="large" onClick={handleCreateServer} >Create Lobby</Button>}
                </Row>
            </Row >
        </App>
    )
}
export default CreateLobby