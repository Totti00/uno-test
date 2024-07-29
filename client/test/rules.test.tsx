import '@testing-library/jest-dom';
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import Rules from '../src/pages/Rules/Rules';
import { BrowserRouter } from 'react-router-dom';

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

describe('Rules component', () => {

    let rulesComponent: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
    beforeEach(() => {
        rulesComponent = render(
            <BrowserRouter>
                <Rules />
            </BrowserRouter>
        )
    });

    it('renders without errors', async () => {
        const { getByText } = await waitFor(() => rulesComponent);
        expect(getByText("Uno Online")).toBeInTheDocument()
    })

    it('must fire events', async () => {
        const { getByText } = await waitFor(() => rulesComponent);
        const back = getByText("Back")
        const join = getByText("Join lobby")
        const create = getByText("Create lobby")
        expect(back).toBeInTheDocument()
        expect(join).toBeInTheDocument()
        expect(create).toBeInTheDocument()
        fireEvent.click(back)
        fireEvent.click(join)
        fireEvent.click(create)
        expect(navigateMock).toHaveBeenCalledTimes(3)
    })
});