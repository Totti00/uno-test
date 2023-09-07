// import Image from "./Image";
// import styled from "styled-components";
// import { motion } from "framer-motion";
//
// const Root = styled.div<CardProps>`
//   --color: var(--${(props) => props.color});
//
//   /* overflow: hidden; */
//   padding-top: 141%;
//   border-radius: calc(var(--cardWidth) / 10);
//
//   box-shadow: ${(props) =>
//     !props.disableShadow ? "0 0 10px #292727" : "none"};
//   position: relative;
//   transform-style: preserve-3d;
//
//   cursor: ${(props) => (props.playable ? "pointer" : "inherit")};
//   filter: ${(props) =>
//     props.selectable && !props.playable ? "contrast(.5)" : "none"};
// `;
//
//
// interface CardProps {
//     id?: string,
//     flip?: boolean,
//     rotationY: number,
//     layoutId?: string,
//     color?: string,
//     digit?: number,
//     action?: string | number,
//     playable?: boolean,
//     disableShadow?: boolean,
//     selectable?: boolean,
// }
//
// const CardTSX = ({
//     id = "",
//     color = "",
//     digit,
//     action = "",
//     flip = false,
//     rotationY = 180,
//     layoutId,
//     selectable,
//     playable,
//     disableShadow = false,
//  }: CardProps) => {
//     const onClick = () => {
//         console.info("CardTSX clicked " + id);
//         //if (playable) API.move(false, id);
//     };
//
//     const getFrontContent = () => {
//         if (color === "black" && action === "wild")
//             return <Image src={`assets/images/wild.png`}/>;
//
//         if (color === "black")
//             return (
//                 <>
//                     <Image src={`assets/images/front-${color}.png`} />
//                     <img src="assets/images/draw4.png" className="card-icon" alt="" />
//                     <img
//                         className="icon-small icon-tl"
//                         src={`assets/images/${action}-blank.png`}
//                         alt=""
//                     />
//                     <img
//                         className="icon-small icon-br"
//                         src={`assets/images/${action}-blank.png`}
//                         alt=""
//                     />
//                 </>
//             );
//
//         if (action)
//             return (
//                 <>
//                     <Image src={`assets/images/front-${color}.png`}/>
//                     <img
//                         src={`assets/images/${action}-${color}.png`}
//                         className="card-icon"
//                         alt=""
//                     />
//                     <img
//                         className="icon-small icon-tl"
//                         src={`assets/images/${action}-blank.png`}
//                         alt=""
//                     />
//                     <img
//                         className="icon-small icon-br"
//                         src={`assets/images/${action}-blank.png`}
//                         alt=""
//                     />
//                 </>
//             );
//         return (
//             <>
//                 <Image src={`assets/images/front-${color}.png`} />
//                 <p className="value">{digit}</p>
//                 <p className="value-small value-tl">{digit}</p>
//                 <p className="value-small value-br">{digit}</p>
//             </>
//         );
//     };
//
//     return (
//         <Root
//             as={motion.div}
//             color={color}
//             className="noselect"
//             layoutId={layoutId}
//             initial={{
//                 rotateY: flip ? Math.abs(180 - rotationY) : rotationY,
//                 y: 0,
//             }}
//             whileHover={
//                 playable
//                     ? { y: -40, transition: { duration: 0.3 } }
//                     : { y: 0, transition: { duration: 0.3 } }
//             }
//             animate={{ rotateY: rotationY, y: 0 }}
//             transition={{ duration: 0.5, ease: "easeInOut" }}
//             selectable={selectable}
//             playable={playable}
//             disableShadow={disableShadow}
//             onClick={onClick}
//         >
//             <div className="front">{getFrontContent()}</div>
//             <div className="back">
//                 <Image src={`assets/images/backside.png`} />
//             </div>
//         </Root>
//     );
// }
//
// export default CardTSX;