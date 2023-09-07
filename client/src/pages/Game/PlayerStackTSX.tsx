// import styled from "styled-components";
// import {useSelector} from "react-redux";
// import {RootState} from "../../store/store.ts";
// import CardsRow from "../../components/jsx/CardsRow.jsx";
//
// const Root = styled.div`
//   position: fixed;
//   bottom: -50px;
//   left: 50%;
//   transform: translateX(-50%);
//   --cardWidth: var(--cardWidthBigger);
// `
//
// const PlayerStackTSX = () => {
//
//     const {player, currentPlayer} = useSelector((state: RootState) => ({
//         player: state.game.players[0],
//         currentPlayer: state.game.currentPlayer
//     }));
//     const cards = player?.cards || [];
//
//     return (
//       <Root>
//           <CardsRow
//             cards={cards}
//             highlight={currentPlayer === 0}
//             cardProps={{selectable: true}}
//           />
//       </Root>
//     );
// }
//
// export default PlayerStackTSX;