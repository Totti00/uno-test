import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    value: Number,
    color: String,
    type: String
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

export const cards = mongoose.model("cards", cardSchema);
