import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputMessage from '../src/components/chat/InputMessage';

describe('InputMessage Component', () => {
    const mockOnSend = jest.fn();

    beforeEach(() => {
        mockOnSend.mockClear();
    });

    it('renders input and button', () => {
        render(<InputMessage onSend={mockOnSend} />);
        
        expect(screen.getByPlaceholderText('Write a message')).toBeInTheDocument();
        expect(screen.getByText('Send')).toBeInTheDocument();
    });

    it('calls onSend with the correct message when form is submitted', () => {
        render(<InputMessage onSend={mockOnSend} />);
        
        const input = screen.getByPlaceholderText('Write a message');
        const button = screen.getByText('Send');

        fireEvent.change(input, { target: { value: 'Hello, World!' } });
        fireEvent.click(button);

        expect(mockOnSend).toHaveBeenCalledWith('Hello, World!');
        expect(input).toHaveValue('');
    });

    it('does not call onSend when input is empty', () => {
        render(<InputMessage onSend={mockOnSend} />);
        
        const button = screen.getByText('Send');
        fireEvent.click(button);

        expect(mockOnSend).not.toHaveBeenCalled();
    });
});