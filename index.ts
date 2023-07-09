import { DiscordBot } from "./old_lib/discordBot.js";
import { WebServer } from "./old_lib/webServer.js";
import { mongo } from "./old_lib/mongo.js";


// Web Server
const webServer: WebServer = new WebServer(mongo);
await webServer.start();

// Discord Bot
const discordBot: DiscordBot = new DiscordBot();
await discordBot.start();
