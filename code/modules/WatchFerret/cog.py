from discord.ext import commands, tasks

import os

import bot_library as b

class WatchFerret(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(WatchFerret(bot))