import { useEffect, useRef } from "react";
import styles from "../../style/Chat.module.css";
import { Message, Player } from "../../utils/interfaces";


interface MessagesProps {
    readonly messages: Message[];
    readonly me: Player;
}

export default function Messages({ messages, me }: MessagesProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null); //reference to an empty div below the latest message

    //automatically scroll down to the latest message whenever a new one pops in
    useEffect(() => {
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    });

    return (
        <ul className={styles.messagesList}>
            {messages.map((m, index) => (
                <MessageCard key={`${m.id}-${index}`} {...m} me={me} />
            ))}
            <div ref={bottomRef}></div>
        </ul>
    );
}

interface MessageCardProps extends Message {
    me: Player;
}

function MessageCard({ player, text, id, me }: MessageCardProps) {
    const username = player.name;
    const messageFromMe = player.name === me.name;
    const className = messageFromMe ? `${styles.messagesMessage} ${styles.currentMember}` : styles.messagesMessage;

    return (
        <li key={id} className={className}>
            <span className={styles.avatar} style={{ backgroundColor: player.color }} />
            <div className={styles.messageContent}>
                <div className={styles.username}>{username}</div>
                <div className={styles.text}>{text}</div>
            </div>
        </li>
    );
}
