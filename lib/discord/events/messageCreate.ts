/**
 * @author p0t4t0sandwich
 * @description MessageCreate event
 */

import { Events, Message } from "discord.js";

import { Logger } from '../../utils/Logger.js';
import { clientId } from '../DiscordBot.js';
import { autoResponse } from "../modules/autoReplies/autoResponse.js";


const logger: Logger = new Logger('MessageCreateEvent', 'discord');

const event = {
    name: Events.MessageCreate,
	async execute(message: Message): Promise<void> {
        autoResponse(message);
	}
}

export { event };
