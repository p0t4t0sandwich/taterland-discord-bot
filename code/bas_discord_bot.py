#!/bin/python3
#--------------------------------------------------------------------
# Project: BAS Network Discord Bot
# Purpose: To add functionality and integrations for the BAS Discord.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 02AUGUST2022
# Updated: 18NOVEMBER2022 p0t4t0sandwich
#--------------------------------------------------------------------

from discord.ext import commands
import discord
import os

import bot_library as b

class BASBot(commands.Bot):
    def __init__(self) -> None:
        intents = discord.Intents.default()
        intents.message_content = True
        self.path = "/bas_discord_bot/"
        self.name = "bas_discord_bot"
        self.synced = True

        super().__init__(
            command_prefix=commands.when_mentioned_or("!"),
            intents=intents,
            help_command=None,
        )

    async def load_extensions(self) -> None:
        for folder in os.listdir("modules"):
            if os.path.exists(os.path.join("modules", folder, "cog.py")):
                b.bot_logger(self.path, self.name, f"Cog {folder} has been loaded")
                await self.load_extension(f"modules.{folder}.cog")

    def log(self, channel, author, content) -> None:
        b.bot_logger(self.path, self.name, f'[{channel}] [{author}] {content}')

    async def on_ready(self) -> None:
        await self.wait_until_ready()
        b.bot_logger(self.path, self.name, f"We have logged in as {self.user}")
        self.owner_id = (await self.application_info()).owner.id
        await self.load_extensions()
        if not self.synced:
            await self.tree.sync()
            self.synced = True

        # On Ready Cog activities
        ADSHandler = self.get_cog("ADSHandler")
        await ADSHandler.initInstances()

        ModdedServerManager = self.get_cog("ModdedServerManager")
        ModdedServerManager.initModule()
        ModdedServerManager.update_status.start()
        ModdedServerManager.update_manager.start()

        MinigameServerManager = self.get_cog("MinigameServerManager")
        MinigameServerManager.initModule()
        MinigameServerManager.update_status.start()
        MinigameServerManager.update_manager.start()

        WatchFerret = self.get_cog("WatchFerret")
        WatchFerret.get_status.start()

if __name__ == "__main__":
    bot = BASBot()
    bot.run(token=os.getenv("BOT_ID"))
    # from dotenv import load_dotenv
    # load_dotenv()
    # bot.run(token=os.getenv("BOT_ID"))
