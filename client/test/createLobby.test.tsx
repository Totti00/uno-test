import { render, screen, waitFor, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import CreateLobby from '../src/pages/Lobby/CreateLobby';
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

describe('Create Lobby', () => {
    let lobbyRenderResult: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;

    beforeEach(() => {
        navigateMock.mockReset();
        lobbyRenderResult = render(
            <Provider store={store}>
                <BrowserRouter>
                    <CreateLobby />
                </BrowserRouter>
            </Provider>
        )
    });

    it('renders form correctly', async () => {
        const { getByText } = await waitFor(() => lobbyRenderResult);
        // Verifica la presenza del pulsante "Back"
        expect(getByText('Back')).toBeInTheDocument();

        // Verifica la presenza dell'input con il placeholder "Insert a lobby name"
        const inputElement = screen.getByPlaceholderText('Insert a lobby name');
        expect(inputElement).toBeInTheDocument();
    });

    /*it('fire events onclick', async () => {
        const { getByText } = await waitFor(() => lobbyRenderResult);

        const inputElement = screen.getByPlaceholderText('Insert a lobby name');
        fireEvent.change(inputElement, { target: { value: 'eeee' } });

        // Verifica che il valore dell'input sia stato aggiornato correttamente
        expect((inputElement as HTMLInputElement).value).toBe('eeee');

        // Verifica che il pulsante "Create Lobby" sia presente
        await waitFor(() => {
            expect(getByText('Create Lobby')).toBeInTheDocument();
        });

        fireEvent.click(getByText('Create Lobby'));

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/waiting'));
    });*/
});