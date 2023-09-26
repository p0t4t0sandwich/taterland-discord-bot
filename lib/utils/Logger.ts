/**
 * @author p0t4t0sandich
 * @description Logger class
 */

import fs from 'fs';


/**
 * @class Logger
 * @description Logger class
 * @param {string} name - Name of the bot
 * @param {string} platform - Platform of the bot
 * @param {string} logPath - Path to save logs
 */
class Logger {
    private name: string;
    private platform: string;
    private logPath: string;

    /**
     * @constructor
     * @param {string} name - Name of the bot
     * @param {string} platform - Platform of the bot
     * @param {string} logPath - Path to save logs
     */
    constructor(name: string, platform: string, logPath?: string) {
        this.name = name;
        this.platform = platform;
        this.logPath = logPath || 'logs';
    }

    /**
     * @method log
     * @description Log a message
     * @param channelId - Channel ID
     * @param userId - User ID
     * @param message - Message to log
     */
    async log(channelId: string, userId: string, message: string): Promise<void> {
        // Get today's date
        const today = new Date();
        const parsedDateTime = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        // Message string
        message = message.replace(/\n/g, "\\n");
        const messageToLog = `[${today.toISOString()}] [${this.name}] [${this.platform}] [${channelId}] [${userId}]: ${message}`;

        if (fs.existsSync(this.logPath) === false) {
            await fs.promises.mkdir(this.logPath);
        }

        // Save to log file
        fs.promises.appendFile(`logs/${parsedDateTime}.log`, messageToLog + '\n');

        console.log(messageToLog);
    }
}

export { Logger };
