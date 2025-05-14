import { Intents } from "oceanic.js";
import { SuperClient } from "./src/SuperClient";

const client = new SuperClient({
    auth: `Bot ${process.env.TOKEN}`,
    gateway: {
        intents: [
            Intents.GUILDS,
            Intents.MESSAGE_CONTENT,
            Intents.GUILD_MESSAGES
        ]
    }
});

process.on("unhandledRejection", (e) => {
    console.log(e);
});

process.on("uncaughtException", (e) => {
    console.log(e);
})

client.start();