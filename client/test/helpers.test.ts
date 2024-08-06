import { wrapMod, canPlayCard, finalCanPlayCard } from '../src/utils/helpers';
import { Card } from '../src/utils/interfaces';

describe('Utility Functions', () => {
  describe('wrapMod', () => {
    it('should wrap around correctly', () => {
      expect(wrapMod(5, 3)).toBe(2);
      expect(wrapMod(-1, 3)).toBe(2);
      expect(wrapMod(3, 3)).toBe(0);
    });
  });

  describe('canPlayCard', () => {
    const oldCard: Card = { color: 'red', digit: 5, action: undefined };
    const newCard: Card = { color: 'red', digit: 7, action: undefined };
    const drawCard: Card = { color: 'blue', digit: undefined, action: 'draw2' };

    it('should allow playing a card of the same color', () => {
      expect(canPlayCard(oldCard, newCard, false)).toBe(true);
    });

    it('should not allow playing a new card if the player has to draw', () => {
      expect(canPlayCard(drawCard, newCard, false)).toBe(false);
    });

    it('should allow playing a black card if the player does not have to draw', () => {
      const blackCard: Card = { color: 'black', digit: undefined, action: 'wild' };
      expect(canPlayCard(oldCard, blackCard, false)).toBe(true);
    });
  });

  describe('finalCanPlayCard', () => {
    const oldCard: Card = { color: 'red', digit: 5, action: undefined };
    const newCard: Card = { color: 'red', digit: 7, action: undefined };
    const drawCard: Card = { color: 'blue', digit: undefined, action: 'draw2' };

    it('should use canPlayCardSelectableColor if color is provided', () => {
      expect(finalCanPlayCard(oldCard, newCard, false, 'red')).toBe(true);
    });

    it('should use canPlayCard if color is not provided', () => {
      expect(finalCanPlayCard(oldCard, newCard, false)).toBe(true);
    });

    it('should not allow playing a draw card if the player has to draw', () => {
      expect(finalCanPlayCard(drawCard, newCard, false)).toBe(false);
    });
  });
});