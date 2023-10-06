/**
 * @author p0t4t0sandwich
 * @description InteractionCreate event
 */

import { CacheType, ChatInputCommandInteraction, Events, Interaction } from 'discord.js';

import { Logger } from '../../utils/Logger.js';
import { CustomClient, clientId } from '../DiscordBot.js';


const logger: Logger = new Logger('InteractionCreateEvent', 'discord');

/**
 * @function handleSlashCommand
 * @param interaction The interaction
 * @description Handles slash commands
 */
async function handleSlashCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const command = (<CustomClient>interaction.client).commands.get(interaction.commandName);
    if (!command) {
        logger.log("Error", clientId, `No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error: any) {
        logger.log("Error", clientId, error.toString());
        console.log(error);
        await interaction.editReply({ content: 'There was an error while executing this command!' });
    }
}

const event = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction<CacheType>): Promise<void> {
        try {
            // Handle slash commands
            if (interaction.isChatInputCommand()) {
                handleSlashCommand(interaction);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { event };
