/**
 * @author p0t4t0sandwich
 * @description ClientReady event
 */

import { Client, Events } from "discord.js";

import { Logger } from '../../utils/Logger.js';
import { clientId } from '../DiscordBot.js';


const logger: Logger = new Logger('ClientReadyEvent', 'discord');

const event = {
    name: Events.ClientReady,
	once: true,
	async execute(client: Client): Promise<void> {
		if (client.user === null) return;
        logger.log("Info", clientId, `Ready! Logged in as ${client.user.tag}`);
	}
}

export { event };
