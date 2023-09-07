// import styled from "styled-components";
// import {useSelector} from "react-redux";
// import CardTSX from "../../components/CardTSX.tsx";
// import {RootState} from "../../store/store.ts";
//
// const Root = styled.div`
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     --cardWidth: var(--cardWithBigger);
//
//   .card-container {
//     position: absolute;
//     top: 0;
//     left: 0;
//     transform: translate(-50%, -50%);
//   }
// `
//
// interface CardData {
//     color?: string,
//     digit?: number,
//     action?: string | number,
// }
//
// const TableStackTSX = () => {
//     const tableStack = useSelector((state: RootState) => state.game.tableStack); // Usa il tipo RootState per tipizzare lo stato
//     return (
//         <Root>
//             {tableStack.map((card: CardData) => (
//             <div className="card-container">
//                 <CardTSX
//                 color={card.color}
//                 digit={card.digit}
//                 action={card.action}
//                 />
//             </div>
//             ))}
//         </Root>
//         );
// }
//
// export default TableStackTSX;