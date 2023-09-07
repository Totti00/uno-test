import DrawingStack from "./jsx/DrawingStack.jsx";
import {Button, Result} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import socketContext from "../../context/SocketContext.ts";

const Game = () => {
    const { state } = useLocation();
    const { rooms } = useContext(socketContext).socketState;
    const navigate = useNavigate()
    const players = rooms[state?.roomName]
    //const [modal, showModal] = useState(false)

    return (
        <>
            {players === undefined || players.length < 2 ?
                <Result
                    status="warning"
                    title="This room do not exist anymore."
                    extra={
                        <Button type="primary" key="console" onClick={() => navigate("/home")}>
                            Go to the homepage
                        </Button>
                    }
                />
                :
                <div style={{ margin: 30 }}>
                    {/*<Row justify="space-between" style={{ marginBottom: 22 }}>*/}
                    {/*    <Button type="primary" onClick={() => showModal(true)} icon={<LeftOutlined />}> Back</Button>*/}
                    {/*    <p>You are: {socket?.id}</p>*/}
                    {/*</Row>*/}

                    {/*<TableStack/>*/}
                    {/*<TopStack />*/}
                    {/*<PlayerStack />*/}
                    <DrawingStack />

                    {/*<Modal open={modal} title="Are you sure to leave the lobby?"*/}
                    {/*       onOk={() => leaveRoom(socket, state?.roomName, true, navigate)}*/}
                    {/*       onCancel={() => showModal(false)}*/}
                    {/*/>*/}
                </div >
            }



        </>
    )
}

export default Game