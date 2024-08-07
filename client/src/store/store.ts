import { configureStore } from '@reduxjs/toolkit';
import gameSlice, {fillCards, userName} from '../reducers';

export const store = configureStore({
    reducer: {
        game: gameSlice,
        fillCards: fillCards.reducer,
        user: userName.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch