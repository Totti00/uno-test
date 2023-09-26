//const cards = require("./prova.json"); //.cards;

let cards = null;

const getCards = async function () {
    try {
        const res = await fetch('http://localhost:3000/cards/', { mode: 'cors' });
        if (!res.ok) {
            throw new Error('Errore nella richiesta');
        }
        cards = await res.json();
        //console.log("Cards: ", cards);
        return cards; // Restituisci i dati solo quando sono disponibili
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

const getCard = function (cardId) {

  return cards.find((c) => c._id === cardId);
};

export {getCards, getCard}
