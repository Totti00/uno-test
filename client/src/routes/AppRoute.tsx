import {Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "../store/store.ts";
import {AnimatePresence} from "framer-motion";
import {ConfigProvider} from "antd";
import Home from "../pages/Home/Home";
import Loading from "../pages/Home/Loading.tsx"
import Rules from "../pages/Rules/Rules"
import Lobby from "../pages/Lobby/Lobby"
import CreateLobby from "../pages/Lobby/CreateLobby";
import WaitingLobby from "../pages/Lobby/WaitingLobby.tsx";
import SocketContextComponent from "../context/SocketContextComponent";
import Game from "../pages/Game/Game";
import ErrorRoute from "./ErrorRoute";
import {useState} from "react";

const AppRoute = (props: any) =>{
    const [loadingAssets, setLoadingAssets] = useState(true);

    const onLoaded = () => {
        setLoadingAssets(false);
    };

    if (loadingAssets) return <Loading onLoaded={onLoaded} />;

    return (
        <Provider store={store}>
        <ConfigProvider

        >
            <AnimatePresence mode='wait'>
                <SocketContextComponent>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/lobby" element={<Lobby />} />
                        <Route path="/create" element={<CreateLobby />} />
                        <Route path="/waiting" element={<WaitingLobby {...props} />} />
                        <Route path="/game" element={<Game {...props}/>} />
                        <Route path="rules" element={<Rules />} />
                        <Route path="*" element={<ErrorRoute />} />
                        {/*{loadingAssets ? (*/}
                        {/*    <Loading onLoaded={onLoaded} />*/}
                        {/*) : (<Route path="/" element={<Home />} />)}*/}
                    </Routes>
                </SocketContextComponent>
            </AnimatePresence>
        </ConfigProvider>
    </Provider>
    )
}
export default AppRoute