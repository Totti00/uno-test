import {render, waitFor} from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import '@testing-library/jest-dom';
import StartPage from "../src/pages/Start/startPage";
import { jest } from '@jest/globals';

const navigateMock = jest.fn();

//Mock delle dipendenze
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom') as object;
  return {
    __esModule: true, // Questo è necessario per i moduli ES6
    ...originalModule,
    useNavigate: () => jest.fn().mockImplementation((path) => {
      return navigateMock(path);
    })
  };
});

describe('StartPage Test', () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('should render correctly', async () => {
      const { getByAltText, getByText } = render(
        <Provider store={store}>
          <BrowserRouter>
            <StartPage />
          </BrowserRouter>
        </Provider>
      );

        await waitFor(() => expect(getByAltText('UNO Logo')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Welcome to UNO The Game')).toBeInTheDocument());
    });

    it('should navigate to /home if playerName is in localStorage', async () => {
        localStorage.setItem('playerName', 'TestPlayer');

        const { getByText } = render(
            <Provider store={store}>
                <BrowserRouter>
                    <StartPage />
                </BrowserRouter>
             </Provider>
        );
        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/home'), {timeout: 3500});
        await waitFor(() => expect(getByText('Welcome to UNO The Game')).toBeInTheDocument());

    });

    it('should navigate to /create-user if playerName is not in localStorage', async () => {
        const { getByText } = render(
          <Provider store={store}>
            <BrowserRouter>
              <StartPage />
            </BrowserRouter>
          </Provider>
        );
    
        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/create-user'), { timeout: 3500 });
        await waitFor(() => expect(getByText('Welcome to UNO The Game')).toBeInTheDocument());
    });
});