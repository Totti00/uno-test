import { Button } from "antd"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Messages from "./Messages"
import InputMessage from './InputMessage';
import { useEffect, useState } from 'react';
import API from '../../api/API';
import { Message } from '../../utils/interfaces';
// import { useState } from 'react';

const style = {
    position: 'absolute' as 'absolute',
    top: '5%',
    left: '15%',
    //   transform: 'translate(-50%, -50%)',
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSendMessage = (text: string) => {
        // console.log("Message sent: " + text);
        const message: Message = {
            player: me,
            text: text,
            id: "1", //sovrascritto lato server
        };
        API.chat(message);
    }

    useEffect(() => {
        API.onChat(({ messages }) => {
            // console.info("CHAT received message ");
            setMessages(messages);
        });

    });

    return (
        <div>
            <Button onClick={handleOpen}>Chat</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button onClick={handleClose}>Back</Button>
                    <div style={{ height: "5%" }} />
                    <Messages messages={messages} me={me} />
                    <InputMessage onSend={handleSendMessage} />
                </Box>
            </Modal>
        </div>
    );
}