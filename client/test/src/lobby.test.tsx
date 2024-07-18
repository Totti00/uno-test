import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/store/store';
import Lobby from '../../src/pages/Lobby/Lobby';
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

describe('Lobby', () => {

    let lobbyRenderResult: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;

    beforeEach(() => {
        lobbyRenderResult = render(
            <Provider store={store}>
                <BrowserRouter>
                    <Lobby />
                </BrowserRouter>
            </Provider>
        )
    });

    it('renders without errors', async () => {
        const { getByText } = await waitFor(() => lobbyRenderResult);
        expect(getByText(/Back/)).toBeInTheDocument()
    });

    it('fire back event', async () => {
        const { getByText } = await waitFor(() => lobbyRenderResult);
        expect(getByText(/Back/)).toBeInTheDocument()
        fireEvent.click(getByText(/Back/))
        expect(navigateMock).toHaveBeenCalledTimes(1)
    })
});