import {
    TypedUseSelectorHook,
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
} from "react-redux";
import {AppDispatch, RootState} from "../store/store";

export const useAppDispatch: () => AppDispatch = useReduxDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;