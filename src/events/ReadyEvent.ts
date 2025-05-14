import type { Client, ClientEvents } from "oceanic.js";
import type { IEventFile } from "../interfaces/IEventFile";

export default class ReadyEvent implements IEventFile<"ready"> {
    name = "ready" as const;
    once = true;

    execute (client: Client) {
        console.log(`The bot has been started in user ${client.user.tag}`);
    }
}