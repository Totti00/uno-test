import { Button, Row } from 'antd';
import API from "../../../api/API.ts";
import Chat from "../../../components/chat/Chat.tsx";
import { useNavigate } from "react-router-dom";
import { Player } from '../../../utils/interfaces.ts';
import WhiteRankingCard from '../../../components/WhiteRankingCard.tsx';

interface RankingProps {
    playersOrder: Player[];
}

const Ranking: React.FC<RankingProps> = ({ playersOrder }) => {
    const navigate = useNavigate();

    const handleLeaveServer = async () => {
        API.leaveServer();
        navigate("/home");
    };

    return (
        <div style={{ margin: 30 }}>
            <Row justify="end">
                <Chat />
            </Row>
            <Row justify="center" style={{ marginTop: 0 }}>
                <WhiteRankingCard players={playersOrder} />
            </Row>
            <Row align="middle" gutter={[0, 16]} justify="center" style={{ position: "absolute", bottom: "18%", width: "50%", textAlign: "center", left: 0, right: 0, marginLeft: "auto", marginRight: "auto" }}
            >
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={handleLeaveServer}>Home</Button>
            </Row>

        </div >
    )
}

export default Ranking;