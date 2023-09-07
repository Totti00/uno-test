import {createContext} from 'react';
import {Socket} from 'socket.io-client';

export interface SocketContextState {
    socket: Socket | undefined;
    uid: string;
    users: Array<string>;
    rooms: any;
    new_turn: boolean
}

export const defaultSocketContextState: SocketContextState = {
    socket: undefined,
    uid: '',
    users: [],
    rooms: {},
    new_turn: false
};

export type SocketContextActions =
    'update_socket' |
    'update_uid' |
    'update_users' |
    'remove_user' |
    'room' |
    'update_rooms' |
    'new_turn'
    ;

type UserToCard = {
    user: string;
    cardTitle: string
}

export type SocketContextPayload = string | Array<string> | Socket | UserToCard | boolean;

export interface SocketContextActionsPayload {
    type: SocketContextActions;
    payload: SocketContextPayload;
}

export const socketReducer = (state: SocketContextState, action: SocketContextActionsPayload) => {
    //console.log('Message received - Action: ' + action.type + ' - Payload: ', action.payload);
    switch (action.type) {
        case 'update_socket':
            return {...state, socket: action.payload as Socket};
        case 'update_uid':
            return {...state, uid: action.payload as string};
        case 'update_users':
            return {...state, users: action.payload as Array<string>};
        case 'remove_user':
            return {...state, users: state.users.filter((user) => user !== action.payload as string)};
        case 'update_rooms':
            return {...state, rooms: action.payload as any};
        case 'new_turn':
            return {...state, new_turn: action.payload as boolean};
        default:
            return state;
    }
}

export interface SocketContextProps {
    socketState: SocketContextState;
    socketDispatch: React.Dispatch<SocketContextActionsPayload>;
}

const socketContext = createContext<SocketContextProps>({
    socketState: defaultSocketContextState,
    socketDispatch: () => { }
});

export const SocketContextProvider = socketContext.Provider;
export const SocketContextConsumer = socketContext.Consumer;

export default socketContext;