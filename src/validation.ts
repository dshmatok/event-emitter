import { z } from "zod";

const EventEmitterConfigSchema = z
    .object({
        logging: z.boolean(),
    })
    .strict()
    .partial()
    .nullish();

const EventTypeSchema = z.union([z.string().min(1), z.symbol()]);
const EventListenerSchema = z.function();

const EventStructSchema = z
    .object({
        listeners: z.set(EventListenerSchema),
    })
    .strict()
    .required();

const EventsMapSchema = z.map(EventTypeSchema, EventStructSchema);

export function validateEventEmitterConfig(value: unknown): asserts value is EventEmitterConfig {
    EventEmitterConfigSchema.parse(value);
}

export function validateEventType(value: unknown): asserts value is EventType {
    EventTypeSchema.parse(value);
}

export function validateEventListener(value: unknown): asserts value is EventListener {
    EventListenerSchema.parse(value);
}

export function validateEventStruct(value: unknown): asserts value is EventStruct {
    EventStructSchema.parse(value);
}

export type EventEmitterConfig = z.TypeOf<typeof EventEmitterConfigSchema>;
export type EventType = z.TypeOf<typeof EventTypeSchema>;
export type EventListener = z.TypeOf<typeof EventListenerSchema>;
export type EventStruct = z.TypeOf<typeof EventStructSchema>;
export type EventsMap = z.TypeOf<typeof EventsMapSchema>;
