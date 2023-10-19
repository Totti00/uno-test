import React from 'react';
import { useEffect, useState } from 'react';
import styles from "../../style/Chat.module.css";
import { Input, Button } from "antd"

export default function InputMessage({ onSend }) {
    const [text, setText] = useState('');

    function onChange(e) {
        const text = e.target.value;
        setText(text);
    }

    function onSubmit(e) {
        e.preventDefault(); // page dosn't refresh at each submit
        if(text !== null && text.trim() !== "")
            onSend(text.trim());
        setText('');
    }

    return (
        < div className={styles.input} justify="center" style={{ position: "absolute", bottom: 10, width: "92%" }}>
            <form onSubmit={e => onSubmit(e)}>
                <Input
                    onChange={e => onChange(e)}
                    value={text}
                    type='text'
                    placeholder='Write a message'
                    autoFocus
                    style={{ height: 50, fontSize: 15, border: "none", width: "86%" }}
                />
                <span style={{ width: "1%" }}>&nbsp;</span>
                <Button style={{ height: 50, width: "12%" }} type="primary" htmlType="submit">Send</Button>
            </form>
        </div >
    )
}