import { DiscordBot } from "./lib/discord/DiscordBot.js";
// import { WebServer } from "./old_lib/webServer.js";
// import { mongo } from "./old_lib/mongo.js";


// Web Server
// const webServer: WebServer = new WebServer(mongo);
// await webServer.start();

// Discord Bot
const discordBot: DiscordBot = new DiscordBot(process.env.DISCORD_TOKEN, process.env.DISCORD_CLIENT_ID);
await discordBot.start();
