import {
    validateEventListener,
    validateEventType,
    validateEventStruct,
    validateEventEmitterConfig,
    type EventType,
    type EventListener,
    type EventsMap,
    type EventStruct,
    type EventEmitterConfig,
} from "./validations";

import { logError, log, assert } from "./utils";

type EventListeners = VoidFunction | EventListener;

interface EventEmitterImpl {
    on(event: EventType, listener: VoidFunction): EventEmitterImpl;
    on<Listener extends EventListener>(event: EventType, listener: Listener): EventEmitterImpl;

    emit(event: EventType): boolean;
    emit<Args extends any[]>(event: EventType, ...args: Args): boolean;
}

export class EventEmitter implements EventEmitterImpl {
    private readonly events: EventsMap = new Map();

    constructor(private readonly config?: EventEmitterConfig) {
        validateEventEmitterConfig(config);

        this.on = this.on.bind(this);
        this.log = this.log.bind(this);
        this.emit = this.emit.bind(this);
        this.assert = this.assert.bind(this);
        this.logError = this.logError.bind(this);
        this.getEventStruct = this.getEventStruct.bind(this);
    }

    /**
     * Add event listener for event
     * @see https://nodejs.org/docs/latest/api/events.html#emitteroneventname-listener
     */
    on(event: EventType, listener: VoidFunction): EventEmitterImpl;
    on<C extends EventListener>(event: EventType, listener: C): EventEmitterImpl;
    on(event: unknown, listener: unknown): EventEmitterImpl {
        try {
            validateEventType(event);
            validateEventListener(listener);

            if (this.events.has(event)) {
                const eventStruct = this.getEventStruct(event);
                eventStruct.listeners.add(listener.bind(listener));
            } else {
                const listeners = new Set<EventListeners>();

                listeners.add(listener.bind(listener));
                this.events.set(event, { listeners: listeners });
            }

            this.log(this.events.entries());
        } catch (error) {
            this.logError(error);
        } finally {
            return this;
        }
    }

    /**
     * Emit event with arguments for event listeners
     * @see https://nodejs.org/docs/latest/api/events.html#emitteremiteventname-args
     */
    emit(event: EventType): boolean;
    emit<Args extends any[]>(event: EventType, ...args: Args): boolean;
    emit(event: unknown, ...args: unknown[]): boolean {
        try {
            validateEventType(event);

            this.assert(this.events.has(event), "uknown event: ", event);

            if (this.events.has(event)) {
                const eventStruct = this.getEventStruct(event);
                eventStruct.listeners.forEach((listener) => listener.apply(listener, args));
            }
        } catch (error) {
            this.logError(error);
            return false;
        } finally {
            return true;
        }
    }

    private getEventStruct(event: EventType): EventStruct {
        const eventStruct = this.events.get(event);
        validateEventStruct(eventStruct);

        return eventStruct;
    }

    private assert(...args: Parameters<typeof assert>): void {
        if (this.config?.logging) {
            assert.apply(assert, args);
        }
    }

    private log(...args: Parameters<typeof log>): void {
        if (this.config?.logging) {
            log.apply(log, args);
        }
    }

    private logError(...args: Parameters<typeof logError>): void {
        if (this.config?.logging) {
            logError.apply(log, args);
        }
    }
}
