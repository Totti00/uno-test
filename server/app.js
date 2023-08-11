const express = require('express');
const socket = require('socket.io');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const serverRouter = require('./src/routes/serverRoutes');

const app = express();
global.appRoot = path.resolve(__dirname);

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/unoProgetto')
    .then(()=> console.log("connected to db"))
    .catch((e)=>console.log(e));

app.use(cors());
app.use(session({
    secret: 'keyboard',
    cookie: {maxAge: 3600000},
    resave: false,
    saveUninitialized: false
}));
//app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use('/', serverRouter);
app.use((req, res)=> {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

const server = app.listen(PORT, () => {
    console.log("Listening on http://localhost:3000");
});

const io = socket(server);

io.on("connection", (socket) => {
    console.log("New user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
        socket.disconnect();
    });
})