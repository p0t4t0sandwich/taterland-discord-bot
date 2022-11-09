#!/usr/bin/python3

from discord.ext import commands

import os

import bot_library as b
from ampapi_handler_async import AMPAPIHandlerAsync

class ADSHandler(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.bot.amp_base_uri = "http://172.16.1.172:8080/",
        self.bot.username = os.getenv("AMP_API_USER")
        self.bot.password = os.getenv("AMP_API_PASSWORD")

    async def on_ready(self) -> None:
        await self.wait_until_ready()
        self.bot.ADS = AMPAPIHandlerAsync(
            baseUri=self.bot.amp_base_uri,
            username=self.bot.amp_username,
            password=self.bot.amp_password
        )

        await self.bot.ADS.LoginAsync()
        self.bot.targets = (await self.bot.ADS.ADSModule_GetInstances())["result"]

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(ADSHandler(bot))