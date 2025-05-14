import { type AnyTextableChannel, type ContainerComponent, type Message, type MessageActionRow, type TextDisplayComponent } from "oceanic.js";
import { EVoteCountTypes } from "../enums/EVoteCountTypes";
import { EVoteStatusTypes } from "../enums/EVoteStatusTypes";

export class SuggestionManager {

    async updateVoteCount(message: Message<AnyTextableChannel>, type: EVoteCountTypes) {
        const containerComponent = message.components as ContainerComponent[];
        const votesInformation = containerComponent[0]?.components[5] as TextDisplayComponent;
        if (!containerComponent[0]) return;

        const content = votesInformation.content;

        const upvotesMatch = content.match(/\*\*Upvotes:\*\* (\d+)/);
        const downvotesMatch = content.match(/\*\*Downvotes:\*\* (\d+)/);

        let upvotes = upvotesMatch ? parseInt(upvotesMatch[1] ?? "-1") : 0;
        let downvotes = downvotesMatch ? parseInt(downvotesMatch[1] ?? "-1") : 0;

        switch (type) {
            case EVoteCountTypes.UPVOTE:
                upvotes++;
                break;
            case EVoteCountTypes.DOWNVOTE:
                downvotes++;
                break;
        }

        const newContent = content
            .replace(/\*\*Upvotes:\*\* \d+/, `**Upvotes:** ${upvotes}`)
            .replace(/\*\*Downvotes:\*\* \d+/, `**Downvotes:** ${downvotes}`);

        votesInformation.content = newContent;
        containerComponent[0].components[5] = votesInformation;

        await message.edit({
            components: containerComponent
        });
    }

    async changeSuggestionStatus(message: Message<AnyTextableChannel>, status: EVoteStatusTypes) {
        const containerComponent = message.components as ContainerComponent[];
        const statusInformation = containerComponent[0]?.components[4] as TextDisplayComponent;
        if (!containerComponent[0]) return;

        const content = statusInformation.content;

        if (status !== EVoteStatusTypes.PENDING) {
            const buttons = containerComponent[0]?.components[6] as MessageActionRow;
            buttons.components[0]!!.disabled = true;
            buttons.components[1]!!.disabled = true;

            containerComponent[0].components[6] = buttons;
        }

        const newContent = content
            .replace(/\*\*Status:\*\* \w+/, `**Status:** ${status}`);

        statusInformation.content = newContent;
        containerComponent[0].components[4] = statusInformation;

        await message.edit({
            components: containerComponent
        });
    }
}