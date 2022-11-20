#!/bin/python3
#--------------------------------------------------------------------
# Module: Funny
# Purpose: Joke/humor related bot commands.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 20NOVEMBER2022
# Updated: <date> <author>
#--------------------------------------------------------------------
from discord.ext import commands
import discord
import requests
import json

import bot_library as b

class Funny(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot

    @commands.hybrid_group()
    async def funny(self, ctx: commands.Context) -> None:
        if ctx.subcommand_passed is None:
            # Init variables
            channel = ctx.guild.name
            author = str(ctx.author)
            content = ctx.message.content

            title = "Subcommands:"
            description = "- dadjoke\n- uselessfact\n- fortune\n- meowfact"
            color = 0xe6d132

            # Log the data
            self.bot.log(channel, author, content)
            self.bot.log(channel, self.bot.user, description)

            embed = discord.Embed(title = title, description = description, color = color)

            await ctx.send(embed=embed)

    @funny.command()
    async def dadjoke(self, ctx: commands.Context) -> None:
        # Init variables
        channel = ctx.guild.name
        author = str(ctx.author)
        content = ctx.message.content

        address = "https://icanhazdadjoke.com/"

        try:
            res = requests.get(address, headers={"Accept":"application/json"}).content.decode()
            title = "Dad Joke:"
            dct = json.loads(res)
            # print(dct)
            funny = dct["joke"]
            # print(dct["id"])
            description = f"{funny}"
            color = 0x65bf65

        except:
            # Error response
            title = f"Error:"
            description = f"Whoops, something went wrong,\ncouldn't reach {address}.\t¯\\\\_(\"/)\_/¯"
            color = 0xbf0f0f

        # Log the data
        self.bot.log(channel, author, content)
        self.bot.log(channel, self.bot.user, description)

        # Output Discord Embed object
        embed = discord.Embed(title = title, description = description, color = color)
        await ctx.send(embed=embed)

    @funny.command()
    async def uselessfact(self, ctx: commands.Context) -> None:
        # Init variables
        channel = ctx.guild.name
        author = str(ctx.author)
        content = ctx.message.content

        address = "https://uselessfacts.jsph.pl/random.json?language=en"

        try:
            res = requests.get(address, headers={"Accept":"application/json"}).content.decode()
            title = "Useless Fact:"
            dct = json.loads(res)
            # print(dct)
            funny = dct["text"]
            description = f"{funny}"
            color = 0x65bf65

        except:
            # Error response
            title = f"Error:"
            description = f"Whoops, something went wrong,\ncouldn't reach {address}.\t¯\\\\_(\"/)\_/¯"
            color = 0xbf0f0f

        # Log the data
        self.bot.log(channel, author, content)
        self.bot.log(channel, self.bot.user, description)

        # Output Discord Embed object
        embed = discord.Embed(title = title, description = description, color = color)
        await ctx.send(embed=embed)

    @funny.command()
    async def fortune(self, ctx: commands.Context) -> None:
        # Init variables
        channel = ctx.guild.name
        author = str(ctx.author)
        content = ctx.message.content

        address = "https://fortuneapi.herokuapp.com/"

        try:
            res = requests.get(address, headers={"Accept":"application/json"}).content.decode()
            title = "Fortune:"
            dct = json.loads(res)
            description = f"{dct}"
            color = 0x65bf65

        except:
            # Error response
            title = f"Error:"
            description = f"Whoops, something went wrong,\ncouldn't reach {address}.\t¯\\\\_(\"/)\_/¯"
            color = 0xbf0f0f

        # Log the data
        self.bot.log(channel, author, content)
        self.bot.log(channel, self.bot.user, description)

        # Output Discord Embed object
        embed = discord.Embed(title = title, description = description, color = color)
        await ctx.send(embed=embed)

    @funny.command()
    async def meowfact(self, ctx: commands.Context) -> None:
        # Init variables
        channel = ctx.guild.name
        author = str(ctx.author)
        content = ctx.message.content

        address = "https://meowfacts.herokuapp.com/"

        try:
            res = requests.get(address, headers={"Accept":"application/json"}).content.decode()
            title = "Meow Fact:"
            dct = json.loads(res)
            fact = dct["data"][0]
            description = f"{fact}"
            color = 0x65bf65

        except:
            # Error response
            title = f"Error:"
            description = f"Whoops, something went wrong,\ncouldn't reach {address}.\t¯\\\\_(\"/)\_/¯"
            color = 0xbf0f0f

        # Log the data
        self.bot.log(channel, author, content)
        self.bot.log(channel, self.bot.user, description)

        # Output Discord Embed object
        embed = discord.Embed(title = title, description = description, color = color)
        await ctx.send(embed=embed)

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(Funny(bot))