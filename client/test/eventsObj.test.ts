import { EventsObject } from '../src/utils/EventsObject';

describe('EventsObject', () => {
  let eventsObject: EventsObject;

  beforeEach(() => {
    eventsObject = new EventsObject();
  });

  test('should add and fire event listeners', () => {
    const mockHandler = jest.fn();
    eventsObject.addEventListener('testEvent', mockHandler);

    eventsObject.fireEvent('testEvent', 'arg1', 'arg2');

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('should remove event listeners', () => {
    const mockHandler = jest.fn();
    eventsObject.addEventListener('testEvent', mockHandler);
    eventsObject.removeEventListener('testEvent', mockHandler);

    eventsObject.fireEvent('testEvent');

    expect(mockHandler).not.toHaveBeenCalled();
  });

  test('should remove all listeners', () => {
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    eventsObject.addEventListener('testEvent1', mockHandler1);
    eventsObject.addEventListener('testEvent2', mockHandler2);

    eventsObject.removeAllListeners();
    eventsObject.fireEvent('testEvent1');
    eventsObject.fireEvent('testEvent2');

    expect(mockHandler1).not.toHaveBeenCalled();
    expect(mockHandler2).not.toHaveBeenCalled();
  });
});
