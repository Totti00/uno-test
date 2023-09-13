import {Button, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";
import API from "../../api/API";

const Home = () => {
    const navigate = useNavigate();

    const onPlayOnlineForCreate = () => {
        API.playOnline();
        navigate("/create")
    };

    const onPlayOnlineForJoin = () => {
        API.playOnline();
        navigate("/lobby");
    };

    useEffect(() => {

    }, []);

    return (
        <div style={{ width: "100%", height: "100%" }}>

            <Row align="middle"
                 gutter={[0, 16]}
                 style={{ position: "absolute", bottom: "18%", width: "50%", textAlign: "center", left: 0, right: 0, marginLeft: "auto", marginRight: "auto" }}
                 justify="space-between"
            >
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={onPlayOnlineForJoin}>Join room</Button>
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={onPlayOnlineForCreate}>Create room</Button>
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={() => navigate("/rules")}>Rules</Button>
            </Row>
        </div >
    )
}
export default Home