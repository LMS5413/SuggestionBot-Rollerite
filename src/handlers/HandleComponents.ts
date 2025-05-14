import { ButtonStyles, ChannelTypes, ComponentTypes, MessageFlags, ModalSubmitInteraction, SeparatorSpacingSize, TextInputStyles, type ContainerComponent, type GuildComponentButtonInteraction, type GuildComponentSelectMenuInteraction, type MessageComponentSelectMenuInteractionData, type TextDisplayComponent } from "oceanic.js";
import config from "../../config.json" assert { type: "json" };
import type { SuperClient } from "../SuperClient";
import { SuggestionManager } from "../managers/SuggestionManager";
import { EVoteCountTypes } from "../enums/EVoteCountTypes";
import { EVoteStatusTypes } from "../enums/EVoteStatusTypes";

const suggestionManager = new SuggestionManager();

export async function handleSelectMenuInteraction(interaction: GuildComponentSelectMenuInteraction) {
    const data = interaction.data;
    const selectedOptions = data.values.getStrings();
    const selectedOption = selectedOptions[0];

    await interaction.createModal({
        title: "Make a suggestion",
        customID: `suggestion-${selectedOption}`,
        components: [
            {
                type: ComponentTypes.ACTION_ROW,
                components: [
                    {
                        type: ComponentTypes.TEXT_INPUT,
                        customID: "suggestion",
                        label: "Your suggestion",
                        style: TextInputStyles.PARAGRAPH,
                        placeholder: "Enter your suggestion here",
                        required: true
                    }
                ]
            }
        ]
    });
}


export async function handleButton(interaction: GuildComponentButtonInteraction) {
    const data = interaction.data;
    const message = interaction.message;

    switch (data.customID) {
        case "suggestion_upvote":
            await suggestionManager.updateVoteCount(message, EVoteCountTypes.UPVOTE);
            await interaction.createMessage({
                content: "You have upvoted this suggestion!",
                flags: MessageFlags.EPHEMERAL
            });
            break;
        case "suggestion_downvote":
            await suggestionManager.updateVoteCount(message, EVoteCountTypes.DOWNVOTE);
            await interaction.createMessage({
                content: "You have downvoted this suggestion!",
                flags: MessageFlags.EPHEMERAL
            });
            break;
    }
}

export async function handleModal(client: SuperClient, interaction: ModalSubmitInteraction) {
    if (interaction.data.customID.startsWith("suggestion-")) {
        const suggestion = interaction.data.components.getTextInput("suggestion");

        if (!suggestion) {
            await interaction.createMessage({
                content: "You must enter a suggestion!",
                flags: MessageFlags.EPHEMERAL
            });
            return;
        }

        const categoryString = interaction.data.customID.split("-")[1]?.trim();
        if (!categoryString) {
            await interaction.createMessage({
                content: "You must select a category!",
                flags: MessageFlags.EPHEMERAL
            });
            return;
        }

        const category = config.categories.find((cat) => cat.name === categoryString);
        if (!category) {
            await interaction.createMessage({
                content: "Invalid category selected! If this is a bug, please contact an admin.",
                flags: MessageFlags.EPHEMERAL
            });
            return;
        }

        const channel = client.getChannel(category.channelId);

        if (!channel || channel.type !== ChannelTypes.GUILD_TEXT) {
            await interaction.createMessage({
                content: "The suggestion channel does not exist! Please contact an admin.",
                flags: MessageFlags.EPHEMERAL
            });
            return;
        }

        await channel.createMessage({
            flags: MessageFlags.IS_COMPONENTS_V2,
            components: [
                {
                    type: ComponentTypes.CONTAINER,
                    components: [
                        {
                            type: ComponentTypes.TEXT_DISPLAY,
                            content: `**Suggestion:** ${suggestion}`
                        },
                        {
                            type: ComponentTypes.TEXT_DISPLAY,
                            content: `**Category:** ${category.name}`
                        },
                        {
                            type: ComponentTypes.TEXT_DISPLAY,
                            content: `**Suggested by:** ${interaction.user.mention}`
                        },
                        {
                            type: ComponentTypes.SEPARATOR,
                            spacing: SeparatorSpacingSize.LARGE,
                            divider: true
                        },
                        {
                            type: ComponentTypes.TEXT_DISPLAY,
                            content: `**Status:** ${EVoteStatusTypes.PENDING}`
                        },
                        {
                            type: ComponentTypes.TEXT_DISPLAY,
                            content: "**Upvotes:** 0\n**Downvotes:** 0"
                        },
                        {
                            type: ComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: ComponentTypes.BUTTON,
                                    style: ButtonStyles.SUCCESS,
                                    label: "👍 Upvote",
                                    customID: "suggestion_upvote"
                                },
                                {
                                    type: ComponentTypes.BUTTON,
                                    style: ButtonStyles.DANGER,
                                    label: "👎 Downvote",
                                    customID: "suggestion_downvote"
                                }
                            ]
                        }
                    ]
                }
            ]
        });


        await interaction.createMessage({
            content: "Your suggestion has been sent!",
            flags: MessageFlags.EPHEMERAL
        });
    }
}