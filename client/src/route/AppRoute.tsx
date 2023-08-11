
import {Provider} from "react-redux";
import {store} from "../store/store.ts";
import {AnimatePresence} from "framer-motion";

const AppRoute = () =>
    <Provider store={store}>
        <AnimatePresence mode='wait'>

        </AnimatePresence>
    </Provider>
export default AppRoute