const gameModel = require('../models/gameModel');

exports.createRoom = async (req, res) => {
    const room = new gameModel(req.body);
    try {
        res.json(await room.save());
    } catch (e) {
        res.json(e);
    }
}

exports.disconnect = async (req, res) => {

}