import { ApplicationCommandTypes, Client, type ClientEvents } from "oceanic.js";
import { loadEvents } from "./utils/EventLoader";
import { loadCommands } from "./utils/CommandModule";

export class SuperClient extends Client {

    async start() {
        await loadEvents(this);
        await this.connect();

        this.on("ready", async () => {
            await loadCommands(this);
        });
    }
    
}