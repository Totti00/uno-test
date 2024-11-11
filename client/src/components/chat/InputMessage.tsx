import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from "../../style/Chat.module.css";
import { Input, Button } from "antd";

interface InputMessageProps {
    onSend: (message: string) => void;
}

const InputMessage: React.FC<InputMessageProps> = ({ onSend }) => {
    const [text, setText] = useState<string>('');

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (text.trim() !== "") {
            onSend(text.trim());
        }
        setText('');
    };

    return (
        <div className={styles.input}>
            <form onSubmit={onSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Input
                    onChange={onChange}
                    value={text}
                    type='text'
                    placeholder='Write a message'
                    autoFocus
                    className={styles.inputField}
                />
                <Button className={styles.sendButton} type="primary" htmlType="submit">
                    Send
                </Button>
            </form>
        </div>
    );
};

export default InputMessage;
