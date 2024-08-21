import { render } from '@testing-library/react';
import AppRoute from '../src/routes/AppRoute';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../src/components/FrontCards', () => () => <div>Mocked FrontCards</div>);

describe('AppRoute', () => {

    it('renders route correctly', () => {
        const { getByText } = render(
            <BrowserRouter>
                <AppRoute />
            </BrowserRouter>
        );
        expect(getByText("Loading Game Assets...")).toBeInTheDocument()
    });
});
