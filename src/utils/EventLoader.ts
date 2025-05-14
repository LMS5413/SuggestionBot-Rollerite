import { readdirSync } from "fs";
import { SuperClient } from "../SuperClient";
import type { IEventFile } from "../interfaces/IEventFile";


export async function loadEvents(client: SuperClient) {
    const eventsFile = readdirSync("./src/events");
    for (const eventFile of eventsFile) {
        const event = new (await import("../events/" + eventFile)).default as IEventFile;
        if (event.once) client.once(event.name, event.execute.bind(null, client) as any)
        else client.on(event.name, event.execute.bind(null, client) as any);
    }
}