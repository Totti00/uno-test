import {PropsWithChildren, useEffect, useReducer} from "react";
import {useSocket} from "../hooks/useSocket";
import {defaultSocketContextState, SocketContextProvider, socketReducer} from "./SocketContext";

export interface SocketContextComponentProps extends PropsWithChildren { }

const SocketContextComponent: React.FunctionComponent<SocketContextComponentProps> = (props) => {
    const { children } = props;

    const [socketState, socketDispatch] = useReducer(socketReducer, defaultSocketContextState);


    const socket = useSocket('ws://localhost:3000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false
    });

    useEffect(() => {
       socket.connect();
       socketDispatch({ type: 'update_socket', payload: socket });
       startListeners();
       sendHandshake();
    }, []);

    const startListeners = () => {

        socket.on('user_connected', (users: string[]) => {
            console.info('User connected message received');
            socketDispatch({ type: 'update_users', payload: users });
        });

        socket.on('update_rooms', (rooms: any) => socketDispatch({type: "update_rooms", payload: rooms?.data}));
    }

    const sendHandshake = async () => {
        console.info('Sending handshake to server...');
        socket.emit('handshake', async (uid: string, users: string[]) => {
            console.info('User handshake callback message received');
            socketDispatch({ type: 'update_users', payload: users });
            socketDispatch({ type: 'update_uid', payload: uid });
        });
    }

    return <SocketContextProvider value={{ socketState: socketState, socketDispatch: socketDispatch }}> {children} </SocketContextProvider>

};

export default SocketContextComponent;