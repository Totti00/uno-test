import { configureStore } from '@reduxjs/toolkit';
import {fillCards, userName} from '../reducers';
import gameSlice from '../reducers';

export const store = configureStore({
    reducer: {
        game: gameSlice,
        fillCards: fillCards.reducer,
        user: userName.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch