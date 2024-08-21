import express from "express";
import http from "http";
import { ServerSocket} from "./socket";
import cors from "cors";
import mongoose from "mongoose";
import {cardsRouter} from "./src/routes/cardsRouter";

const app = express();

const PORT = 3000;

const httpServer = http.createServer(app);

// Creation of the ServerSocket instance to listen to the socket
// The serverSocketInstance variable is not used directly, but it is necessary to initialize the server socket
ServerSocket.initialize(httpServer);

mongoose.connect("mongodb://localhost:27017/unoProgetto")
    .then(() =>  console.log("Connected to database"))
    .catch((err) => console.log(err));

app.use(cors());

app.use(express.json());
app.use(cardsRouter);

app.use((req, res)=> {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

httpServer.listen(PORT, () => {
    console.log("Listening on http://localhost:3000");
});