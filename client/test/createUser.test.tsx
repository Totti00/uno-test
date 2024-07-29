import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CreateUser from '../src/pages/CreateUser/create';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';

describe('CreateUser', () => {

    let rulesComponent: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
    beforeEach(() => {
        rulesComponent = render(
        <Provider store={store}>
          <BrowserRouter>
            <CreateUser />
          </BrowserRouter>
        </Provider>
        )
        localStorage.clear();
    });

    it('should render the component correctly', () => {
        const { getByText, getByPlaceholderText, container } = rulesComponent;
        expect(getByText("Enter Your Name")).toBeInTheDocument();
        expect(getByPlaceholderText('')).toBeInTheDocument();
        expect(container.querySelector('.dot')).toBeInTheDocument();
    });

    it('should load playerName and playerColor from localStorage', () => {
        localStorage.setItem('playerName', 'TestPlayer');
        localStorage.setItem('playerColor', '#ff0000');

        // Re-render the component to reflect localStorage changes
        rulesComponent = render(
            <Provider store={store}>
                <BrowserRouter>
                    <CreateUser />
                </BrowserRouter>
            </Provider>
        );

        const {getByDisplayValue, container} = rulesComponent;

        expect(getByDisplayValue('TestPlayer')).toBeInTheDocument();
        const dot = container.querySelector('.dot');
        expect(dot).toHaveStyle('background-color: #ff0000');
    });

    it('should update localStorage when PlayerName changes', async () => {
        const { getByPlaceholderText } = rulesComponent;
        const input = getByPlaceholderText('') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'New Player' } });
        await waitFor(() => {
            expect(localStorage.getItem('playerName')).toBe('New Player');
        });
    });

    it('should display Save & Go button when playerName is not empty and has more than one character', () => {
        const { getByPlaceholderText, queryByText } = rulesComponent;

        const input = getByPlaceholderText('') as HTMLInputElement;

        fireEvent.change(input, { target: { value: '' } });
        expect(queryByText('Save & Go')).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'A' } });
        expect(queryByText('Save & Go')).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'AB' } });
        expect(queryByText('Save & Go')).toBeInTheDocument();
    });

    it('should navigate to /home when Save & Go is clicked', async () => {
        const { getByPlaceholderText, getByText } = rulesComponent;

        const input = getByPlaceholderText('') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test' } });

        const button = getByText('Save & Go').closest('a') as HTMLAnchorElement;
        expect(button).toHaveAttribute('href', '/home');
    });
});