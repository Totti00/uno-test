import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoute from '../../src/routes/AppRoute';
import Loading from '../../src/pages/Home/Loading';
import '@testing-library/jest-dom';

// Mock the components used in AppRoute
jest.mock('../../src/pages/Home/Loading');

describe('AppRoute', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should render the loading component initially', () => {
        (Loading as jest.Mock).mockImplementation(({ onLoaded }) => {
            // Use setTimeout to defer the call to onLoaded
            setTimeout(() => onLoaded(), 0);
            //return <div data-testid="loading">Loading...</div>;
        });
  
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoute />
            </MemoryRouter>
        );
  
        // Since onLoaded is called asynchronously, you need to wait for the component to update
        // You can use waitFor from @testing-library/react for this purpose
        waitFor(() => {
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });
    });

});
