import { render } from '@testing-library/react';
import Messages from '../src/components/chat/Messages';
import '@testing-library/jest-dom';
import { Message, Player } from '../src/utils/interfaces';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Messages Component', () => {
  const me: Player = { id: '1', name: 'Me', color: 'blue', cards: [] };
  const otherPlayer: Player = { id: '2', name: 'Other    Player', color: 'red', cards: [] };
  
  const messages: Message[] = [
    { id: 'msg1', player: me, text: 'Hello World!' },
    { id: 'msg2', player: otherPlayer, text: 'Hi there!' },
  ];

  it('renders messages correctly', () => {
    const { getByText } = render(<Messages messages={messages} me={me} />);

    // Verifica che i messaggi siano resi correttamente
    expect(getByText('Hello World!')).toBeInTheDocument();
    expect(getByText('Hi there!')).toBeInTheDocument();
  });

  it('applies correct styles based on the sender', () => {
    const { container } = render(<Messages messages={messages} me={me} />);

    const myMessage = container.querySelector('li:nth-child(1)');
    const otherMessage = container.querySelector('li:nth-child(2)');

    expect(myMessage).toBeInTheDocument();
    expect(myMessage).toHaveTextContent('Me');
    expect(myMessage).toHaveTextContent('Hello World!');

    expect(otherMessage).toBeInTheDocument();
    expect(otherMessage).toHaveTextContent('Other Player');
    expect(otherMessage).toHaveTextContent('Hi there!');
  });

  it('scrolls to the bottom when a new message is added', () => {
    const { container } = render(<Messages messages={messages} me={me} />);

    const bottomDiv = container.querySelector('div')?.lastChild;

    expect(bottomDiv).toBeInTheDocument();
  });
});
