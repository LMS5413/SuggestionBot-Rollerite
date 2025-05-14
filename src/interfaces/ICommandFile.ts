import { type ApplicationCommandOptions, CommandInteraction } from "oceanic.js";

export interface ICommandFile {
    name: string
    description: string
    options?: ApplicationCommandOptions[]
    permissions?: string
    execute(interaction: CommandInteraction): Promise<any> | any
}