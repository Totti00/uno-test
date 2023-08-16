import {Button, Row} from "antd";
import {LeftOutlined, ReloadOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react"
import socketContext from "../../context/SocketContext";
import WhiteLobbyCard from "../../components/WhiteLobbyCard";

const Lobby = () => {
    const { socket, users, rooms } = useContext(socketContext).socketState;
    const navigate = useNavigate()

    const reloadPage = () =>
        socket?.emit("get_rooms", () => { });

    useEffect(() => {
        reloadPage()
    }, []);

    return (
        <div style={{ margin: 20 }}>
            <Row justify="space-between" align="middle">
                <Button icon={<LeftOutlined />} type="primary" onClick={() => navigate("/")}>Back</Button>
                <Button icon={<ReloadOutlined />} type="primary" onClick={() => reloadPage()}>Refresh</Button>
            </Row>
            <Row justify="center" style={{ marginTop: 22 }}>
                title={`Choose a room ____________. \n\nUsers Online: ${users.length}`}
            </Row>
            <Row justify={"center"} style={{ marginTop: 22 }} gutter={[32, 32]}>
                {Object.keys(rooms).map((roomName, index) =>
                    <WhiteLobbyCard join roomName={roomName} players={rooms[roomName]} key={index} />
                )}
            </Row>
        </div>
    )
}

export default Lobby