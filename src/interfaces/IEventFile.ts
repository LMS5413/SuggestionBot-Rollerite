import type { ClientEvents } from "oceanic.js";
import type { SuperClient } from "../SuperClient";

export type EventKeys = keyof ClientEvents;

export interface IEventFile<T extends EventKeys = EventKeys> {
    name: T;
    once?: boolean;
    execute: (client: SuperClient, ...args: ClientEvents[T]) => Promise<void> | void;
}