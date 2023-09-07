import {PropsWithChildren, useEffect, useReducer} from "react";
import {useSocket} from "../hooks/useSocket";
import {defaultSocketContextState, SocketContextProvider, socketReducer} from "./SocketContext";
import {useNavigate} from "react-router-dom";

export interface SocketContextComponentProps extends PropsWithChildren { }

const SocketContextComponent: React.FunctionComponent<SocketContextComponentProps> = (props) => {
    const { children } = props;

    const [socketState, socketDispatch] = useReducer(socketReducer, defaultSocketContextState);
    const navigate = useNavigate()

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

        socket.on('start_game', (isFirst: boolean, roomName: string) => navigate("/game", {
            state: {
                isFirst: isFirst,
                roomName: roomName
            }
        }));
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