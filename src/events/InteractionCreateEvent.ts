import {
    type ClientEvents,
    type GuildComponentButtonInteraction,
    type GuildComponentSelectMenuInteraction
} from "oceanic.js";
import type { IEventFile } from "../interfaces/IEventFile";
import { handleButton, handleModal, handleSelectMenuInteraction } from "../handlers/HandleComponents";
import type { SuperClient } from "../SuperClient";

export default class InteractionCreateEvent implements IEventFile<"interactionCreate"> {
    name = "interactionCreate" as const;

    async execute(client: SuperClient, interaction: ClientEvents["interactionCreate"][0]) {
        if (interaction.isComponentInteraction()) {
            if (interaction.isSelectMenuComponentInteraction()) {
                handleSelectMenuInteraction(interaction as GuildComponentSelectMenuInteraction);
            }

            if (interaction.isButtonComponentInteraction()) {
                handleButton(interaction as GuildComponentButtonInteraction);
            }
        }

        if (interaction.isModalSubmitInteraction()) {
            handleModal(client, interaction);
        }
    }
}