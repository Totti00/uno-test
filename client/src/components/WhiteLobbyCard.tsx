import { /*Button*/ List } from 'antd';
import styled from 'styled-components';
import {Player} from "../utils/interfaces.ts";

const Card = styled.div`
  height: 25em;
  width: 18.75em;
  position: relative;
  font-family: "Poppins", sans-serif;
  border: 1px solid #000;
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
interface WhiteLobbyCard {
    roomName: string,
    players: Player[] | undefined
}

const WhiteLobbyCard = ({ roomName, players}: WhiteLobbyCard) => {
    return (
            <Card>
                <Front>
                    <Title style={{ color: "#000000" }}>{roomName}</Title>
                    <List
                        header={<div>Players inside: {players?.length} </div>}
                        dataSource={players?.map((player: Player) => player.name)}
                        renderItem={(item: string) => <List.Item style={{ textAlign: "center" }}>{item}</List.Item>}
                    />
                </Front>
            </Card >
    )
}
export default WhiteLobbyCard;
