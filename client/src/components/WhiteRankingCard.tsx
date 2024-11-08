import { /*Button*/ List } from 'antd';
import styled from 'styled-components';
import { Player } from "../utils/interfaces.ts";

const Card = styled.div`
  height: 25em;
  width: 18.75em;
  position: relative;
  font-family: "Poppins", sans-serif;
  //border: 1px solid #000;
  border-radius: 0.6em;
`
const Front = styled.div`
  padding:20px;
  background-color: #ffffff;
  /*height: 100%;
  width: 100%;*/
  font-size: 1.2em;
  border-radius: 0.6em;
  backface-visibility: hidden;
  text-align: center;
`
const Title = styled.h3`
  font-weight: 500;
  letter-spacing: 0.05em;
`
interface WhiteRankingCard {
  players: Player[],
}

const WhiteRankingCard = ({ players }: WhiteRankingCard) => {
  return (
    <Card>
      <Front>
        <Title style={{ color: "#000000" }}>Ranking</Title>
        <List
          dataSource={players}
          renderItem={(player: Player) => (
            <List.Item key={player.id} style={{ display: 'flex', alignItems: 'center', justifyContent:'flex-start' }}>
              <span className="dot" style={{
                backgroundColor: player.color,
                height: "30px",
                width: "30px",
                borderRadius: "50%",
                display: "inline-block",
                marginRight: "10px"
              }} />
              <div>{player.name}</div>
            </List.Item>
          )}
        />
      </Front>
    </Card >
  )
}
export default WhiteRankingCard;
