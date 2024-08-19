import { Button } from "antd"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Messages from "./Messages"
import InputMessage from './InputMessage';
import { useEffect, useState } from 'react';
import API from '../../api/API';
import { Message } from '../../utils/interfaces';

const styleDiv = {
    display: 'flex',
    justifyContent: 'space-between',
};

const styleButton = {
    marginLeft: 'auto',
};

const style = {
    position: 'absolute',
    top: '5%',
    left: '15%',
    width: '70%',
    height: '85%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    opacity: 0.9
};

export default function Chat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const me = API.getPlayer();

    const handleOpen = () => {
        (async () => {
            const chatHistory = await API.getChat();
            setMessages(chatHistory);
        })();
        setOpen(true);
    }
    const handleClose = () => setOpen(false);
    const handleSendMessage = (text: string) => {
        const message: Message = {
            player: me,
            text: text,
            id: "1", //overwritten on the server side
        };
        API.chat(message);
    }

    useEffect(() => {
        API.onChat(({ messages }) => {
            setMessages(messages);
        });
    });

    return (
        <div style={styleDiv}>
            <Button style={styleButton} onClick={handleOpen}>Chat</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button onClick={handleClose}>Back</Button>
                    <div style={{ height: "5%" }} />
                    <div style={{ overflow: "auto", height: "80%"}}>
                        <Messages messages={messages} me={me} />
                    </div>
                    <InputMessage onSend={handleSendMessage} />
                </Box>
            </Modal>
        </div>
    );
}