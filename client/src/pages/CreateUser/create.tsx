import React, { useState, useEffect } from "react";
import Paper from "../../components/jsx/Paper";
import Grid from "@mui/material/Grid";
import TextField from "../../components/jsx/TextField";
import Button from "../../components/Button";
import Typography from "../../components/Typography";

const CreateUser = () => {
    const getLocalStorageName = () => {
        if (localStorage.getItem("playerName"))
            return localStorage.getItem("playerName");
        else return "";
    };

    const getLocalStorageColor = () => {
        if (localStorage.getItem("playerColor"))
            return localStorage.getItem("playerColor");
        else return randomColor();
    };

    const [playerName, setPlayerName] = useState<string>(getLocalStorageName() || "");
    const [playerColor] = useState<string>(getLocalStorageColor() || "");


    useEffect(() => {
        localStorage.setItem("playerName", playerName);
        localStorage.setItem("playerColor", playerColor);
    }, [playerColor, playerName]);

    return (
        <Paper>
            <Grid container justifyContent="center" spacing={2}>
                <Grid item xs={10}>
          <span className="dot" style={{
              backgroundColor: playerColor,
              height: "80px",
              width: "80px",
              border: "5px solid white",
              borderRadius: "50%",
              display: "inline-block"}} />
                </Grid>
                <Grid item xs={10}>
                    <Typography>Enter Your Name</Typography>
                </Grid>
                <Grid item xs={10} md={6}>
                    <TextField
                        type="text"
                        placeholder=""
                        value={playerName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
                        pad
                    />
                </Grid>

                <Grid item xs={10}>
                    {playerName && (
                        <Button href="/home">
                            <Typography> Save & Go </Typography>
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

function randomColor() {
    const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    return '#' + '0'.repeat(6 - randomHex.length) + randomHex;
}

export default CreateUser;