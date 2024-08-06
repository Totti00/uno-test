import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Card from '../src/components/Card';
import '@testing-library/jest-dom';
import { setColorSelection } from '../src/reducers';

const mockStore = configureStore([]);
const initialState = {
  game: {
    colorSelection: false,
  },
};

const renderWithProvider = (ui: JSX.Element, store: any) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('Card Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders Card component', () => {
    renderWithProvider(<Card color="red" digit={5} />, store);

    const elements = screen.getAllByText('5');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('handles onClick event for playable card', () => {
    renderWithProvider(<Card id="1" color="black" action="wild" playable />, store);

    fireEvent.click(screen.getByRole('button'));

    const actions = store.getActions();
    expect(actions).toContainEqual(setColorSelection({ colorSelection: true }));
  });

  it('displays color selector when colorSelection is true', () => {
    renderWithProvider(<Card id="1" color="black" action="wild" playable />, store);

    fireEvent.click(screen.getByRole('button'));

    // Verifica che il color selector sia visibile
    const colorSelectorItems = document.querySelectorAll('.color-selector-item-inner');
    expect(colorSelectorItems).toHaveLength(4);

    // Verifica i colori di sfondo
    expect(colorSelectorItems[0]).toHaveStyle('background-color: red');
    expect(colorSelectorItems[1]).toHaveStyle('background-color: blue');
    expect(colorSelectorItems[2]).toHaveStyle('background-color: green');
    expect(colorSelectorItems[3]).toHaveStyle('background-color: yellow');
  });
});