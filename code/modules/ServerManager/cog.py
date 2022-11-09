#!/usr/bin/python3

from discord.ext import commands

import os

import bot_library as b
from ampapi_handler_async import AMPAPIHandlerAsync

class ServerManager(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.username = os.getenv("AMP_API_USER")
        self.password = os.getenv("AMP_API_PASSWORD")

    # async def 

    @commands.command()
    @commands.is_owner()
    async def stuff(self, ctx: commands.Context, *args) -> None:
        if args[0] == "all":
            for folder in os.listdir("modules"):
                if os.path.exists(os.path.join("modules", folder, "cog.py")):
                    b.bot_logger(self.bot.path, self.bot.name, f"Cog {folder} has been reloaded")
                    await self.bot.reload_extension(f"modules.{folder}.cog")
        else:
            for i in args:
                b.bot_logger(self.bot.path, self.bot.name, f"Cog {i} has been reloaded")
                await self.bot.reload_extension(f"modules.{i}.cog")

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(ServerManager(bot))