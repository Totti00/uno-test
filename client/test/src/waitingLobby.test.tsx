import { fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/store/store';
import WaitingLobby from '../../src/pages/Lobby/WaitingLobby';
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

describe('Waiting Lobby', () => {
    it("renders a back button", () => {
        const { getByText } = render(
            <Provider store={store}>
                <BrowserRouter>
                    <WaitingLobby />
                </BrowserRouter>
            </Provider>
        );

        const backButton = getByText("Back");

        expect(backButton).toBeInTheDocument();
    });

    it('navigates back to home on confirm leave', async () => {
        const { getByText } = render(
          <Provider store={store}>
            <BrowserRouter>
              <WaitingLobby />
            </BrowserRouter>
          </Provider>
        );
    
        const backButton = getByText('Back');
        
        // Simula il click sul pulsante "Back"
        fireEvent.click(backButton);
        
        // Simula la conferma nel Popconfirm
        await waitFor(() => {
          fireEvent.click(getByText('Yes'));
        });
        
        // Verifica la chiamata della navigazione a "/home"
        expect(navigateMock).toHaveBeenCalledWith('/home');
    });
});