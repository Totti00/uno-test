import {Button, Col, Row, Typography} from "antd"
import {useNavigate} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons";

const Rules = () => {
    const navigate = useNavigate()

    return (
        <div style={{margin: 30}}>
            <Button icon={<LeftOutlined/>} type="primary" onClick={() => navigate(-1)}>Back</Button>
            <Row justify="center" style={{margin: "22px 0"}}>
                <Typography.Title level={2} style={{ color: "white" }}>
                    Uno Online
                </Typography.Title>
            </Row>
            <Row style={{width: "auto"}} align="middle" justify="center" gutter={[32, 0]}>
                <Col>

                </Col>
            </Row>
            <p style={{margin: "22px 0", color:"white"}}>
            Uno is the most popular card game played by millions of people around the world. It is played by matching and then discarding cards in your hand until there are none left. Here are the rules of the original or classic Uno.

            The game is for 4 players. Each player starts with seven cards, which are dealt face down. The rest of the cards are placed face down and become the draw pile. Next to that is the discard pile. The top card is placed in the discard pile and the game begins!

            Each player takes turns looking at their cards and trying to match the card in the discard pile. You must match by number, color, or symbol/action. If the player has no matches or chooses not to play any of their cards even though they might have a match, they must draw a card. 
            If that card can be played, play it. Otherwise, keep it and play passes to the next person in turn. You can also play an action card. Keep in mind that you can only put down one card at a time; you cannot stack two or more cards together in the same turn.

            The player who has no more cards in his hand wins. When a player has only one card, he must click on the "UNO!" button. Otherwise, that player must draw two new cards as a penalty.

            Action Cards: In addition to the number cards, there are several other cards that help mix up the game. They are called Action or Symbol cards and are:
            Reverse: changes the turn sequence;
            Skip: when a player places this card, the next player must skip his turn;
            Draw Two: when a person places this card, the next player must draw two cards;
            Wild: the player must declare which color the next player will draw.
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