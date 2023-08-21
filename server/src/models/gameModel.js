// const mongoose = require('mongoose');
// const playerSchema = new mongoose.Schema({
//     sockedId: String,
//     name: String,
//     connectedSince: Number,
//     roomName: String,
// });
//
// const roomSchema = new mongoose.Schema({
//     name: String,
//     status: String,
//     capacity: Number,
//     playerTurn: Number,
//     admin: playerSchema,
//     cards: [String],
//     players: [playerSchema]
// }, {
//     versionKey: false // You should be aware of the outcome after set to false
// });
//
// const Room = mongoose.model("room", roomSchema);
//
// module.exports = Room;



const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    value: Number,
    color: String,
    type: String
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const Cards = mongoose.model("cards", cardSchema);

module.exports = Cards;