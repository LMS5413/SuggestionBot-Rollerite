import { ApplicationCommandOptionTypes, MessageFlags, Permissions, TextChannel, type ApplicationCommandOptionsSubCommand, type CommandInteraction, type ContainerComponent, type TextDisplayComponent } from "oceanic.js";
import type { ICommandFile } from "../interfaces/ICommandFile";
import { SuggestionManager } from "../managers/SuggestionManager";
import { EVoteStatusTypes } from "../enums/EVoteStatusTypes";

export default class SuggestionChangeStatusCommand implements ICommandFile {

    name = "suggestion-change";
    description = "Approve or deny a suggestion";
    permissions = Permissions.MANAGE_MESSAGES.toString();

    options: ApplicationCommandOptionsSubCommand[] = [
        {
            name: "approve",
            description: "Approve a suggestion",
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: "id",
                    description: "The ID of the suggestion to approve",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        },
        {
            name: "reject",
            description: "Reject a suggestion",
            type: ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: "id",
                    description: "The ID of the suggestion to reject",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        }
    ];

    private suggestionManager = new SuggestionManager();


    async execute(interaction: CommandInteraction): Promise<any> {
        const subcommand = interaction.data.options.getSubCommand()!![0];
        const id = interaction.data.options.getString("id");
        if (!id) {
            return interaction.createMessage({
                content: "You must provide a suggestion ID",
                flags: MessageFlags.EPHEMERAL
            });
        }

        const message = await (interaction.channel as TextChannel).getMessage(id).catch(() => null);
        if (!message) {
            return interaction.createMessage({
                content: "That suggestion does not exist",
                flags: MessageFlags.EPHEMERAL
            });
        }

        const containerComponent = message.components as ContainerComponent[] | undefined;
        if (!containerComponent?.length) {
            return interaction.createMessage({
                content: "That suggestion does not exist",
                flags: MessageFlags.EPHEMERAL
            });
        }
        const statusInformation = containerComponent[0]?.components[4] as TextDisplayComponent;
        if (!statusInformation?.content) {
            return interaction.createMessage({
                content: "That suggestion does not exist",
                flags: MessageFlags.EPHEMERAL
            });
        }

        switch (subcommand) {
            case "approve":
                await this.suggestionManager.changeSuggestionStatus(message , EVoteStatusTypes.APPROVED);
                return interaction.createMessage({
                    content: "Suggestion has been approved",
                    flags: MessageFlags.EPHEMERAL
                });
            case "reject":
                await this.suggestionManager.changeSuggestionStatus(message, EVoteStatusTypes.REJECTED);
                return interaction.createMessage({
                    content: "Suggestion has been rejected",
                    flags: MessageFlags.EPHEMERAL
                });
        }

    }
}