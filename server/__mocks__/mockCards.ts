import { ICard } from '../src/utils/interfaces';

const generateCards = (color: 'red' | 'green' | 'blue' | 'yellow', startId: number): ICard[] => {
    const cards: ICard[] = [];
    for (let digit = 0; digit <= 9; digit++) {
      cards.push({ _id: `${startId++}`, digit, color });
      if (digit !== 0) {
        cards.push({ _id: `${startId++}`, digit, color });
      }
    }
    const actions: ('skip' | 'reverse' | 'draw2')[] = ['skip', 'reverse', 'draw2'];
    actions.forEach(action => {
      for (let i = 0; i < 2; i++) {
        cards.push({ _id: `${startId++}`, color, action });
      }
    });
    return cards;
};
  
const generateBlackCards = (startId: number): ICard[] => {
    const cards: ICard[] = [];
    const actions: ('draw4' | 'wild')[] = ['draw4', 'wild'];
    actions.forEach(action => {
      for (let i = 0; i < 4; i++) {
        cards.push({ _id: `${startId++}`, color: 'black', action });
      }
    });
    return cards;
};

export const mockCards = jest.fn(async () => {
    let startId = 1;
    const colors: ('red' | 'green' | 'blue' | 'yellow')[] = ['red', 'green', 'blue', 'yellow'];
    let cards: ICard[] = [];
    colors.forEach(color => {
        cards = cards.concat(generateCards(color, startId));
        startId += 25; // 19 digit cards + 6 action cards
    });
    cards = cards.concat(generateBlackCards(startId));
    return cards;
});