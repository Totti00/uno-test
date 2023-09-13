//const cards = require("./prova.json"); //.cards;

const getCards = function () {
    let cards = {};
    fetch('http://localhost:3000/cards/', { mode: 'cors' })
        .then((res) => cards = res.json())
        .catch((err) => {
            console.log(err.message);
        });
    return cards;
}

const getCard = function (cardId) {
  let cards = {};
  fetch('http://localhost:3000/cards/', { mode: 'cors' })
      .then((res) => cards = res.json())
      .catch((err) => {
        console.log(err.message);
      });
  return cards.find((c) => c.id === cardId);
};

export {getCards, getCard}
