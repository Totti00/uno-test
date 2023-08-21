const gameModel = require('../models/gameModel');

exports.getCards = async (req, res) => {
    try {
        const cards = await gameModel.find({}).lean().exec();
        res.status(200).send(cards);
    } catch (error) {
        res.status(500).send(error.message);
    }
}