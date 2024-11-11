import { Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Table from "../../components/Table";
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Grid from "@mui/material/Grid";
import API from "../../api/API";
import styled from "styled-components";
import { setInLobby, setPlayerId } from "../../reducers";
import { useDispatch } from "react-redux";
import { GameServer } from "../../utils/interfaces";

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


const JoinButtonContainer = styled(Grid)`
    margin: 60px;
    display: flex;
    justify-content: center;

    @media (max-width: 600px) {
        margin: 40px; /* Margine più piccolo su mobile */
    }

    .join-button {
        margin-top: 60px !important; /* Usa !important per forzare la priorità */
    }
`;

// Stile per la griglia delle lobby
const StyledLobbyGrid = styled(Grid)`
    margin-bottom: 40px; /* Distanza tra la griglia e il pulsante */
`;

// Stile per il pulsante "Join Game"
/*const StyledButtonContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  margin-top: 60px; /!* Margine maggiore per il distacco *!/
  
  @media (max-width: 600px) {
    margin-top: 40px; /!* Margine più piccolo su mobile *!/
      
  }
`;*/

const Lobby = () => {
    const navigate = useNavigate();
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
        if (selectedServer !== null) {
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

            {/* Griglia delle lobby */}
            <StyledLobbyGrid item xs={12}>
                <Table>
                    {servers.map((server, index) => (
                        <CTableRow
                            key={server.id}
                            onClick={() => {
                                setSelectedServer(index);
                                setSelectOne(true);
                            }}
                            style={
                                index === selectedServer
                                    ? { backgroundColor: "rgba(0,0,0,.5)", borderRadius: "1rem" }
                                    : {}
                            }
                        >
                            <>
                                <CTableCell>{server.name}</CTableCell>
                                <CTableCell>{server.cntPlayers}</CTableCell>
                            </>
                        </CTableRow>
                    ))}
                </Table>
            </StyledLobbyGrid>

            {/* Pulsante Join Game */}
            <JoinButtonContainer item xs={12}>
                {selectOne && (
                    <Button onClick={handleJoinServer} className="join-button">
                        <Typography>Join Game</Typography>
                    </Button>
                )}
            </JoinButtonContainer>
        </div>
    );
}

export default Lobby;
