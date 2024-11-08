import { Button, Popconfirm, Row } from "antd"
import {useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons"
import WhiteLobbyCard from "../../components/WhiteLobbyCard.tsx";
import {useDispatch, useSelector} from "react-redux";
import {init, setFirstCard, setInLobby} from "../../reducers.ts";
import {RootState} from "../../store/store.ts";
import API from "../../api/API.ts";
import {Player} from "../../utils/interfaces.ts";
import Chat from "../../components/chat/Chat.tsx"

const WaitingLobby = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [players, setPlayers] = useState<Player[]>([]);
    const [server, setServer] = useState<string>("");
    const inLobby = useSelector((state: RootState) => state.game.inLobby);

    useEffect(() => {
        if (!inLobby) return;
        let timeout: string | number | NodeJS.Timeout | null | undefined = null;
        let unsubInit: (() => void) | null = null;

        const fetchServerPlayers = async () => {
            const serverPlayers = await API.getServerPlayers();
            setPlayers(serverPlayers);
            API.onPlayersUpdated((players) => setPlayers(players));
            unsubInit = API.onGameInit(handleGameInit);
            const server = await API.getServerByPlayerId(serverPlayers[0].id);
            setServer(server);
        };

        const handleGameInit = ({ players, cards, card, nxtPlayer }: { players: any, cards: any, card: any, nxtPlayer: any }) => {
            dispatch(setFirstCard({ firstCard: card, firstPlayer: nxtPlayer }));
            dispatch(init({ cards, players }));
            timeout = setTimeout(() => navigate("/game"), 2000);
        };

        fetchServerPlayers();
        
        return () => {
            if (timeout) clearTimeout(timeout);
            if (unsubInit) unsubInit();
            dispatch(setInLobby(false));
        };
    },[inLobby, dispatch, navigate]);

    const handleJoinServer = async () => {
        API.leaveServer();
        navigate("/home");
    };

    return (
        <div style={{ margin: 30 }}>
            <Row justify="space-between">
                {players.length < 4 && (
                    <Popconfirm
                        title="Leave lobby alert"
                        description="Are you sure to exit?"
                        onConfirm={handleJoinServer}
                        okText="Yes"
                        cancelText="No"
                        >
                        <Button icon={<LeftOutlined />} type="primary" >Back</Button>
                    </Popconfirm>
                )}
                <Chat/>
            </Row>
            <Row justify="center" style={{ padding: "20px", marginTop: window.innerWidth < 600 ? "32px" : "16px" }}>
                <WhiteLobbyCard roomName={server} players={players} />
            </Row>
            {/*<Row justify="center" style={{ marginTop: 22 }}>*/}
            {/*    {players.length === 4 &&*/}
            {/*        <Button*/}
            {/*            onClick={() => startGame(socket, state?.roomName, navigate)}*/}
            {/*            style={{ width: 200 }}*/}
            {/*            type="primary"*/}
            {/*            size="large"*/}
            {/*        >*/}
            {/*            Start Game*/}
            {/*        </Button>*/}
            {/*    }*/}
            {/*</Row>*/}
        </div >
    )
}

export default WaitingLobby