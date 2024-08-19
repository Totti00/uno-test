let cards: any = null;

const getCards = async function (): Promise<any> {
    try {
        const res = await fetch('http://localhost:3000/cards/', { mode: 'cors' });
        if (!res.ok) {
            throw new Error(`Errore nella richiesta: ${res.status} ${res.statusText}`);
        }
        cards = await res.json();
        return cards; // Return the data only when it is available
    } catch (err) {
        console.log("Errore sconosciuto ", err);
    }
}

const getCard = function (cardId: string): any {
    return cards.find((c: any) => c._id === cardId);
};

export { getCards, getCard };