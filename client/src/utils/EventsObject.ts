type EventHandler = (...args: any[]) => void;

export class EventsObject {
    events: Record<string, EventHandler[]> = {};

    addEventListener(name: string, handler: EventHandler): void {
        if (Object.prototype.hasOwnProperty.call(this.events, name)) {
            this.events[name].push(handler);
        } else {
            this.events[name] = [handler];
        }
    }

    removeEventListener(name: string, handler: EventHandler): void {
        if (!Object.prototype.hasOwnProperty.call(this.events, name)) return;

        const index = this.events[name].indexOf(handler);
        if (index !== -1) {
            this.events[name].splice(index, 1);
        }
    }

    removeAllListeners(): void {
        this.events = {};
    }

    fireEvent(name: string, ...args: any[]): void {
        if (!Object.prototype.hasOwnProperty.call(this.events, name)) return;

        if (!args) args = [];

        const eventHandlers = this.events[name];
        const numHandlers = eventHandlers.length;

        for (let i = 0; i < numHandlers; i++) {
            eventHandlers[i](...args);
        }
    }
}