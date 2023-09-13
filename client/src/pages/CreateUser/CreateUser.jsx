import React from "react";
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

  const [playerName, setPlayerName] = React.useState(getLocalStorageName);

  React.useEffect(() => {
    localStorage.setItem("playerName", playerName);
  }, [playerName]);

  return (
    <Paper>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={10}>
          <Typography>Enter Your Name</Typography>
        </Grid>
        <Grid item xs={10} md={6}>
          <TextField
            type="text"
            placeholder=""
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
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

export default CreateUser;
