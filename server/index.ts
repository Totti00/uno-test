import express from "express";
import http from "http";
import { ServerSocket} from "./socket";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import {cardsRouter} from "./src/routes/cardsRouter";

const app = express();

const PORT = 3000;

const httpServer = http.createServer(app);

// Creazione dell'istanza di ServerSocket per mettere in ascolto la socket
// La variabile serverSocketInstance non viene utilizzata direttamente, ma è necessaria per inizializzare il server socket
const serverSocketInstance = new ServerSocket(httpServer);

mongoose.connect("mongodb://localhost:27017/unoProgetto")
    .then(() =>  console.log("Connected to database"))
    .catch((err) => console.log(err));

app.use(cors());
app.use(session({
    secret: 'keyboard',
    cookie: {maxAge: 3600000},
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(cardsRouter);

app.use((req, res)=> {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

httpServer.listen(PORT, () => {
    console.log("Listening on http://localhost:3000");
});