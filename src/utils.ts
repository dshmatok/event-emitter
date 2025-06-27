export function log(...args: Parameters<typeof console.log>): void {
    console.log("[event-emitter]", ...args);
}

export function logError(...args: Parameters<typeof console.error>): void {
    console.error("[event-emitter]", ...args);
}

export function assert(...args: Parameters<typeof console.assert>): void {
    console.assert(args[0], `[event-emitter] ${args.slice(1, args.length).map(String).join(" ")}`);
}
