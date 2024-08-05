import { Row } from "antd";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react"
import Table from "../../components/Table";
import Typography from "../../components/Typography"
import Button from "../../components/Button";
import Grid from "@mui/material/Grid";
import API from "../../api/API";
import styled from "styled-components";
import {setInLobby, setPlayerId} from "../../reducers";
import {useDispatch} from "react-redux";
import {GameServer} from "../../utils/interfaces";

const CTableRow = styled.div`
  justify-content: space-around;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-radius: 2rem;
  height: 45px;
  &:hover {
    cursor: pointer;
  }
`;
const CTableCell = styled.p`
  height: 30px;
  width: calc(100% / 3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Lobby = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [selectedServer, setSelectedServer] = useState<number | null>(null);
    const [selectOne, setSelectOne] = useState(false); //for show button
    const [servers, setServers] = useState<GameServer[]>([]);

    useEffect(() => {
        API.playOnline();
        (async () => {
            const servers = await API.getServers();
            setServers(servers);
        })();
        const interval = setInterval(async () => {
            const servers = await API.getServers();
            setServers(servers);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleJoinServer = async () => {
        if (selectedServer !== null && selectedServer !== undefined) {

            const serverId = servers[selectedServer].id;
            const playerId = await API.joinServer(serverId);
            dispatch(setPlayerId(playerId));
            dispatch(setInLobby(true));
            navigate("/waiting");
        }
    };

    return (
        <div style={{ margin: 20 }}>
            <Row justify="space-between" align="middle">
                <Button buttonType="default" onClick={() => navigate(-1)}>Back</Button>
            </Row>
            {/*<Row justify="center" style={{ marginTop: 22 }}>
                title={`Choose a room ____________. \n\nUsers Online: ${users.length}`}
            </Row>*/}
            {/*<Row justify={"center"} style={{ marginTop: 22 }} gutter={[32, 32]}>*/}
            {/*    {Object.keys(rooms).map((roomName, index) =>*/}
            {/*        <WhiteLobbyCard join roomName={roomName} players={rooms[roomName]} key={index} />*/}
            {/*    )}*/}
            {/*</Row>*/}

            <Grid item xs={12}>
                <Table>
                    {servers.map((server, index) => {
                        return (
                            <CTableRow
                                key={index}
                                onClick={() => {
                                    setSelectedServer(index);
                                    setSelectOne(true);
                                }}
                                style={
                                    index === selectedServer
                                        ? {
                                            backgroundColor: "rgba(0,0,0,.5)",
                                            borderRadius: "1rem",
                                        }
                                        : {}
                                }
                            >
                                <>
                                    <CTableCell>{server.name}</CTableCell>
                                    <CTableCell>{server.cntPlayers}</CTableCell>
                                </>
                            </CTableRow>
                        );
                    })}
                </Table>
            </Grid>
            <Grid item xs={12}>
                {((selectOne) ? (
                    <Button onClick={handleJoinServer}>
                        <Typography>Join Game</Typography>
                    </Button>
                ): (<> </>))}
            </Grid>
        </div>
    )
}

export default Lobby