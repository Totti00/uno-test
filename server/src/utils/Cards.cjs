//const cards = require("./prova.json"); //.cards;

const getCards = async function () {
    try {
        const res = await fetch('http://localhost:3000/cards/', { mode: 'cors' });
        if (!res.ok) {
            throw new Error('Errore nella richiesta');
        }
        const data = await res.json();
        console.log("Cards: ", data);
        return data; // Restituisci i dati solo quando sono disponibili
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

const getCard = function (cardId) {

  return cards.find((c) => c.id === cardId);
};

export {getCards, getCard}
