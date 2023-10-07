// import React, { useEffect, useRef } from "react";
import { useEffect, useRef } from "react";
import styles from "../../style/Home.module.css";
import { Message, Player } from "../../utils/interfaces";


interface MessagesProps {
    messages: Message[];
    me: Player;
}

export default function Messages({ messages, me }: MessagesProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null); //reference to an empty div below the latest message

    //automatically scroll down to the latest message whenever a new one pops in
    useEffect(() => {
        if (bottomRef && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    });

    return (
        <ul className={styles.messagesList}>
            {messages.map((m) => (
                MessageCard(m, me)
            ))}
            <div ref={bottomRef}></div>
        </ul>
    );
}

function MessageCard({ player, text, id }: Message, me: Player) {
    const username = player.name;

    const messageFromMe = player.name === me.name;
    const className = messageFromMe ? `${styles.messagesMessage} ${styles.currentMember}` : styles.messagesMessage;

    return (
        <li key={id} className={className}>
            <span className={styles.avatar} style={{ backgroundColor: randomColor() }} />
            <div className={styles.messageContent}>
                <div className={styles.username}>{username}</div>
                <div className={styles.text}>{text}</div>
            </div>
        </li>
    );
}

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
