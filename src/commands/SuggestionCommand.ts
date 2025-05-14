import { ComponentTypes, MessageFlags, type CommandInteraction } from "oceanic.js";
import type { ICommandFile } from "../interfaces/ICommandFile";
import config from "../../config.json";

export default class SuggestionCommand implements ICommandFile {

    name = "suggestion";
    description = "Create a new suggestion";

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.createMessage({
            content: "What category is your suggestion?",
            flags: MessageFlags.EPHEMERAL,
            components: [
                {
                    type: ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: ComponentTypes.STRING_SELECT,
                            customID: "category",
                            placeholder: "Select a category",
                            options: config.categories.map((category) => {
                                return {
                                    label: category.name,
                                    value: category.name,
                                    description: category.description
                                }
                            }),
                        }
                    ]

                }
            ]
        });
    }

}