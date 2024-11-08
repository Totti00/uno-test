import {Button, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import API from "../../api/API";
import styled from "styled-components";

const LogoImage = styled.img`
    width: 35%;
    max-width: 300px; // Optional max width for larger screens

    @media (max-width: 600px) {
        width: 60%; // Smaller width for mobile screens
    }
`;

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

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {/*<Row justify="center" style={{ width: "100%", marginTop: "-17vh" }}>   Adjust marginTop to translate upwards
                <img src="assets/images/uno-logo.png" alt="UNO Logo" style={{ width: "35%" }}/>
            </Row>*/}
            <Row justify="center" style={{ width: "100%", marginTop: "-17vh" }}>  {/* Adjust marginTop to translate upwards */}
                <LogoImage src="assets/images/uno-logo.png" alt="UNO Logo" />
            </Row>
            <Row
                align="middle"
                gutter={[0, 16]}
                style={{
                    width: "50%",
                    textAlign: "center",
                    position: "absolute",
                    bottom: "18%",
                    left: 0,
                    right: 0,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                justify="space-between"
            >
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={onPlayOnlineForJoin}>Join lobby</Button>
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={onPlayOnlineForCreate}>Create lobby</Button>
                <Button style={{ width: 150, height: 50, fontSize: 18 }} size="large" onClick={() => navigate("/rules")}>Rules</Button>
            </Row>
        </div>
    )
}
export default Home