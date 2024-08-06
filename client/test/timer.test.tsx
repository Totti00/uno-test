import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from '../src/pages/Game/Timer';
import API from "../src/api/API";
import { useAppSelector } from "../src/hooks/hooks";
import { setColorSelection } from "../src/reducers";
import { useDispatch } from "react-redux";

// Mock API
jest.mock("../src/api/API");
jest.mock("../src/hooks/hooks", () => ({
    useAppSelector: jest.fn(),
}));
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

describe('Timer Component', () => {
    const mockDispatch = jest.fn();
    const mockUseAppSelector = useAppSelector as jest.Mock;
    const mockUseDispatch = useDispatch as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseDispatch.mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ currentPlayer: 'player1' });
    });

    it('renders the timer when showTimer is true', () => {
        (API.onResetTimer as jest.Mock).mockImplementation((callback: (moveTime: number) => void) => {
            callback(10);
        });

        render(<Timer />);

        const timerText = screen.getAllByText((_, element) => {
            return (element?.textContent ?? '').includes('Time left:')
        });
        expect(timerText.length).toBeGreaterThan(0);
        timerText.forEach(t => {
            expect(t).toBeInTheDocument();
        });
    });

    it('does not render the timer when showTimer is false', () => {
        (API.onResetTimer as jest.Mock).mockImplementation((callback: (moveTime: number) => void) => {
            callback(0);
        });

        render(<Timer />);

        const timerText = screen.queryByText('Time left:');
        expect(timerText).not.toBeInTheDocument();
    });

    it('calls API.move and dispatches setColorSelection on timeout', () => {
        (API.onResetTimer as jest.Mock).mockImplementation((callback: (moveTime: number) => void) => {
            callback(10);
        });

        (API.onTimeOut as jest.Mock).mockImplementation((callback: () => void) => {
            callback();
        });

        render(<Timer />);

        expect(mockDispatch).toHaveBeenCalledWith(setColorSelection({ colorSelection: false }));
        expect(API.move).toHaveBeenCalledWith(true, "");
    });

    it('decrements the timer every second', () => {
        jest.useFakeTimers();

        (API.onResetTimer as jest.Mock).mockImplementation((callback: (moveTime: number) => void) => {
            callback(10);
        });

        render(<Timer />);

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        const timerValue = screen.getAllByText((_, element) => {
            return (element?.textContent ?? '').includes('7')
        });
        expect(timerValue.length).toBeGreaterThan(0);
        timerValue.forEach(t => {
            expect(t).toBeInTheDocument();
        });
    
        jest.useRealTimers();
    });
});