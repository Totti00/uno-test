import {Button, Col, Row, Typography} from "antd"
import {useNavigate} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons";

const Rules = () => {
    const navigate = useNavigate()

    return (
        <div style={{margin: 30}}>
            <Button icon={<LeftOutlined/>} type="primary" onClick={() => navigate(-1)}>Back</Button>
            <Row justify="center" style={{margin: "22px 0"}}>
                <Typography.Title level={2}>
                    Uno Online
                </Typography.Title>
            </Row>
            <Row style={{width: "auto"}} align="middle" justify="center" gutter={[32, 0]}>
                <Col>

                </Col>
            </Row>
            <p style={{margin: "22px 0"}}>
            Uno Online is a card game played with a deck of 108 cards. The game is played with 4 players. The game is played in rounds.

            The first player to get rid of all their cards wins the round. The winner of the round gets points based on
            the cards left in the other players’ hands. The first player to reach 500 points wins the game.
            </p>
            <Row align="middle" justify="center" gutter={[32, 32]}>
                <Col>
                    <Button type="primary" style={{width: 150, height: 50, fontSize: 18}} size="large" onClick={() => navigate("/lobby")}>Join lobby</Button>
                </Col>
                <Col>
                    <Button type="primary" style={{width: 150, height: 50, fontSize: 18}} size="large" onClick={() => navigate("/create")}>Create lobby</Button>
                </Col>
            </Row>
        </div>
    )

}

export default Rules