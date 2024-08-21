import { render, screen, fireEvent } from '@testing-library/react';
import UnoButton from '../src/components/UnoButton';
import API from "../src/api/API";
import '@testing-library/jest-dom';

// Mock API
jest.mock("../src/api/API");

describe('UnoButton Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the button when showUNO is true', () => {
        (API.onShowUNO as jest.Mock).mockImplementation((callback: (showButton: boolean) => void) => {
            callback(true);
        });

        render(<UnoButton />);

        const button = screen.getByText('UNO !');
        expect(button).toBeInTheDocument();
    });

    it('does not render the button when showUNO is false', () => {
        (API.onShowUNO as jest.Mock).mockImplementation((callback: (showButton: boolean) => void) => {
            callback(false);
        });

        render(<UnoButton />);

        const button = screen.queryByText('UNO !');
        expect(button).not.toBeInTheDocument();
    });

    it('calls API.UNO when the button is clicked', () => {
        (API.onShowUNO as jest.Mock).mockImplementation((callback: (showButton: boolean) => void) => {
            callback(true);
        });

        render(<UnoButton />);

        const button = screen.getByText('UNO !');
        fireEvent.click(button);

        expect(API.UNO).toHaveBeenCalled();
    });
});