#!/bin/python3
#--------------------------------------------------------------------
# Module: Map Art
# Purpose: Commands to allow images to be converted to MC pixel art.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 18NOVEMBER2022
# Updated: <date> <author>
#--------------------------------------------------------------------
from discord.ext import commands

import bot_library as b

class MapArt(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(MapArt(bot))