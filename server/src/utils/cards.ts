let cards: any = null;

const getCards = async function (): Promise<any> {
    try {
        const res = await fetch('http://localhost:3000/cards/', { mode: 'cors' });
        /*if (!res.ok) {
            throw new Error('Errore nella richiesta');
        }*/
        cards = await res.json();
        //console.log("Cards: ", cards);
        return cards; // Restituisci i dati solo quando sono disponibili
    } catch (err) {
        if (err instanceof Error) {
            //console.log(err.message);
            console.error(err.message);
            throw err;
        } else {
            console.log("Errore sconosciuto");
            throw new Error("Errore sconosciuto");
        }
    }
}

const getCard = function (cardId: string): any {
    return cards.find((c: any) => c._id === cardId);
};

export { getCards, getCard };