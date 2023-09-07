import { configureStore } from '@reduxjs/toolkit';
import {fillCards, gameSlice, userName} from '../reducers';

export const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
        fillCards: fillCards.reducer,
        user: userName.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch