import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/store/store';
import AppRoute from '../../src/routes/AppRoute';
import StartPage from '../../src/pages/Start/startPage';
import Home from '../../src/pages/Home/Home';
import Loading from '../../src/pages/Home/Loading';
import '@testing-library/jest-dom';

// Mock the components used in AppRoute
jest.mock('../../src/pages/Start/startPage');
jest.mock('../../src/pages/Home/Home');
jest.mock('../../src/pages/Home/Loading');

describe('AppRoute', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should render the loading component initially', () => {
        (Loading as jest.Mock).mockImplementation(({ onLoaded }) => {
            // Use setTimeout to defer the call to onLoaded
            setTimeout(() => onLoaded(), 0);
            return <div data-testid="loading">Loading...</div>;
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

    test('should render StartPage after loading', async () => {
        (Loading as jest.Mock).mockImplementation(({ onLoaded }) => {
            // Use setTimeout to defer the call to onLoaded
            setTimeout(() => onLoaded(), 0);
            return <div data-testid="loading">Loading...</div>;
        });

        (StartPage as jest.Mock).mockImplementation(() => <div data-testid="start-page">Start Page</div>);

        render(
            <MemoryRouter initialEntries={['/']}>
                <Provider store={store}>
                    <AppRoute />
                </Provider>
            </MemoryRouter>
        );

        // Wait for the loading to complete and the StartPage component to be displayed
        waitFor(() => {
            expect(screen.findByTestId('start-page')).toBeInTheDocument();
        });
    });

    test('should render Home page when navigating to /home', async () => {
        (Loading as jest.Mock).mockImplementation(({ onLoaded }) => {
            onLoaded(); // Call the onLoaded function to simulate assets loading completion
            return <div data-testid="loading">Loading...</div>;
        });

        (Home as jest.Mock).mockImplementation(() => <div data-testid="home-page">Home Page</div>);

        render(
            <MemoryRouter initialEntries={['/home']}>
                <Provider store={store}>
                    <AppRoute />
                </Provider>
            </MemoryRouter>
        );

        // Ensure the Home component is displayed after loading
        waitFor(() => {
            expect(screen.findByTestId('home-page')).toBeInTheDocument();
        });
    });
});
