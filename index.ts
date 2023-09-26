import { DiscordBot } from "./lib/discord/DiscordBot.js";

// Discord Bot
const discordBot: DiscordBot = new DiscordBot(<string><unknown>process.env.DISCORD_TOKEN, <string><unknown>process.env.DISCORD_CLIENT_ID);
await discordBot.start();
