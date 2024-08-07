import {Routes, Route, useLocation} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "../store/store.ts";
import {AnimatePresence} from "framer-motion";
import Home from "../pages/Home/Home";
import Loading from "../pages/Home/Loading.tsx"
import Rules from "../pages/Rules/Rules"
import Lobby from "../pages/Lobby/Lobby"
import CreateLobby from "../pages/Lobby/CreateLobby";
import WaitingLobby from "../pages/Lobby/WaitingLobby.tsx";
import Game from "../pages/Game/Game";
import ErrorRoute from "./ErrorRoute";
import StartPage from "../pages/Start/startPage.tsx";
import CreateUser from "../pages/CreateUser/create";
import {useState} from "react";
import styled from "styled-components";

const Root = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  /* background: radial-gradient(#5065da, #20295a); */
  background: radial-gradient(#3d50ba, #161d3f);
`;

const AppRoute = (props: any) =>{
    const [loadingAssets, setLoadingAssets] = useState(true);

    const onLoaded = () => {
        setLoadingAssets(false);
    };

    const location = useLocation();

    if (loadingAssets) return <Loading onLoaded={onLoaded} />;

    return (
        <Root>
            <Provider store={store}>
                <AnimatePresence mode='wait'>
                        <Routes location={location} key={location.key}>
                            <Route key={"/"} path="/" element={<StartPage />} />
                            <Route key={"/create-user"} path="/create-user" element={<CreateUser />} />
                            <Route key={"/home"} path="/home" element={<Home />} />
                            <Route key={"/lobby"} path="/lobby" element={<Lobby />} />
                            <Route key={"/create"} path="/create" element={<CreateLobby />} />
                            <Route key={"/waiting"} path="/waiting" element={<WaitingLobby {...props} />} />
                            <Route key={"/game"} path="/game" element={<Game {...props}/>} />
                            <Route key={"/rules"} path="/rules" element={<Rules />} />
                            <Route key={"*"} path="*" element={<ErrorRoute />} />
                        </Routes>
                </AnimatePresence>
            </Provider>
        </Root>
    )
}
export default AppRoute