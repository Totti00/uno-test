import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from "../../style/Chat.module.css";
import { Input, Button } from "antd";

interface InputMessageProps {
    onSend: (message: string) => void;
}

const InputMessage: React.FC<InputMessageProps> = ({ onSend }) => {
    const [text, setText] = useState<string>('');

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setText(text);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // page doesn't refresh at each submit
        if (text.trim() !== "") {
            onSend(text.trim());
        }
        setText('');
    };

    return (
        <div className={styles.input} style={{ position: "absolute", bottom: 10, width: "92%" }}>
            <form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    value={text}
                    type='text'
                    placeholder='Write a message'
                    autoFocus
                    style={{ height: 50, fontSize: 15, border: "none", width: "86%" }}
                />
                <span style={{ width: "1%" }}>&nbsp;</span>
                <Button style={{ height: 50, width: "12%" }} type="primary" htmlType="submit">Send</Button>
            </form>
        </div>
    );
};

export default InputMessage;