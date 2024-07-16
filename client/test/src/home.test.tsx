import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/store/store';
import Home from '../../src/pages/Home/Home';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

const navigateMock = jest.fn();

//Mock delle dipendenze
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom') as { [key: string]: any };
  return {
    __esModule: true, // Questo è necessario per i moduli ES6
    ...originalModule,
    useNavigate: () => jest.fn().mockImplementation((path) => {
      return navigateMock(path);
    })
  };
});


describe('Home', () => {

  it('renders correctly and can navigate', () => {
    const { getByText } = render(
        <Provider store={store}>
            <BrowserRouter>
                <Home />
            </BrowserRouter>
         </Provider>
    );

    const join = getByText('Join lobby')
    const create = getByText('Create lobby')
    const rules = getByText('Rules')

    // Verifica la presenza dei bottoni
    expect(getByText('Join lobby')).toBeInTheDocument();
    expect(getByText('Create lobby')).toBeInTheDocument();
    expect(getByText('Rules')).toBeInTheDocument();
    
    // Simula il click e verifica la navigazione
    fireEvent.click(join);
    expect(navigateMock).toHaveBeenCalledWith('/lobby');

    fireEvent.click(create);
    expect(navigateMock).toHaveBeenCalledWith('/create');

    fireEvent.click(rules);
    expect(navigateMock).toHaveBeenCalledWith('/rules');
  });
});