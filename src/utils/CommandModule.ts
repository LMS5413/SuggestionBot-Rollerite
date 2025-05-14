import { readdirSync } from "fs";
import type { ICommandFile } from "../interfaces/ICommandFile";
import { SuperClient } from "../SuperClient";
import { ApplicationCommandTypes, CommandInteraction, Permissions } from "oceanic.js";

const commands: Map<String, ICommandFile> = new Map();

export async function loadCommands(client: SuperClient) {
    const commandsFile = readdirSync("./src/commands");
    for (const commandFile of commandsFile) {
        const command = new (await import("../commands/" + commandFile)).default as ICommandFile;
        await client.application.createGlobalCommand({
            name: command.name,
            description: command.description,
            type: ApplicationCommandTypes.CHAT_INPUT,
            options: command.options ?? [],
            defaultMemberPermissions: command.permissions,
        });

        commands.set(command.name, command);
    }

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommandInteraction()) return;
        const interactionEvent = interaction as CommandInteraction;
        const command = commands.get(interactionEvent.data.name);
        if (command) await command.execute(interactionEvent);
    });
}