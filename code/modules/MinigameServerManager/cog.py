#!/bin/python3
#--------------------------------------------------------------------
# Module: Minigame Server Manager
# Purpose: Program that manages the starting/status display of servers.
# Author: Dylan Sperrer (p0t4t0sandwich|ThePotatoKing)
# Date: 18NOVEMBER2022
# Updated: <date> <author>
#--------------------------------------------------------------------

from discord.ext import commands, tasks
from mcstatus import JavaServer
import discord
import base64
import re
import json
import os

import bot_library as b

path = "./bas_discord_bot/"
instance_addresses = {}


async def server_status(address: str) -> JavaServer:
    # Java
    java = await JavaServer.async_lookup(address, timeout=0.5)
    try: 
        java_status = await java.async_status()
    except:
        java_status = None

    try: 
        java_query = await java.async_query()
    except:
        java_query = None

    return (java_status, java_query)

async def decode_icon(server_icon: str, address: str) -> discord.File:
    """
    Input:
        :param server_icon:
    Function: Uses the API to convert mcip into a dictionary, grabs base64 png data and
            returns it as a discord.File() object.
    Returns: discird.File()
    """

    filename = address.replace(":", "-").replace(".", "-")

    if "data:image/png;base64," in server_icon:
        try:
            with open(path + f"server-icons/{filename}.png", "wb") as f:
                f.write(base64.b64decode(server_icon.split(",")[1]))
                f.close()
            with open(path + f"server-icons/{filename}.png", "rb") as f:
                picture = discord.File(f, filename="image.png")
                f.close()
        except:
            with open(path + "server-icons/default-64.png", "rb") as f:
                picture = discord.File(f, filename="image.png")
                f.close()
    else:
        with open(path + "server-icons/default-64.png", "rb") as f:
                picture = discord.File(f, filename="image.png")
                f.close()

    return picture

async def status(address: str, instance_name: str) -> discord.Embed | discord.File:
        # Init variables
        (java_status, java_query) = await server_status(address)

        # Logic for the server-icon.
        if java_status != None and "favicon" in java_status.raw.keys():
            file = await decode_icon(java_status.favicon, address)
        else:
            file = await decode_icon("None", address)

        image = f"attachment://image.png"


        # Logic to send the Java Server status
        if java_query != None:
            title = f"Minigame Server: {instance_name}"
            description = f"""{re.sub('[§][a-z0-9]','',java_query.motd)}
            Players: {java_query.players.online}/{java_query.players.max}
            {java_query.software.brand}: {java_query.software.version}
            """

            # Add Colour
            color = 0x65bf65

        elif java_status != None:
            title = f"Minigame Server: {instance_name}"
            description = f"""{re.sub('[§][a-z0-9]','',java_status.description)}
            Players: {java_status.players.online}/{java_status.players.max}
            Version: {java_status.version.name}
            """

            # Add Colour
            color = 0x65bf65

        else:
            # Error response
            title = f"Minigame Server: {instance_name}"
            description = f"Whoops, something went wrong,\ncouldn't reach {instance_name}.\t¯\\\\_(\"/)\_/¯"
            color = 0xbf0f0f

        # Output Discord Embed object
        embed = discord.Embed(title=title, description=description, color=color)
        embed.set_image(url=image)

        return (embed, file)

async def save_message(channel_id, message_id) -> None:
    filename = path + "/minigame_embed_messages.json"
    if not os.path.exists(filename):
        with open(filename, "w") as f:
            f.write("{\"messages\":[" + f"{channel_id}-{message_id}" + "]}")
            f.close()

    else:
        with open(filename) as json_file:
            messages = json.load(json_file)
            json_file.close()

        new_messages = messages
        new_messages["messages"].append(f"{channel_id}-{message_id}")

        with open(filename, "w") as outfile:
            json.dump(new_messages, outfile, indent = 4)
            outfile.close()

class MinigameServerManager(commands.Cog, discord.ui.View):
    def __init__(self, bot) -> None:
        discord.ui.View.__init__(self, timeout=None)
        self.bot = bot
        self.status_dict = {}
        self.inactive_dict = {}
        self.host = "172.16.1.176"

    @discord.ui.button(label='Start', style=discord.ButtonStyle.green, custom_id='persistent_view:start')
    async def start(self, interaction: discord.Interaction, button: discord.ui.Button) -> None:
        msg = interaction.message
        instance_name = msg.embeds.pop().title.split("Server: ")[1]
        status = await self.confirm_server_activation(instance_name)

        if status == True:
            text = f"Server {instance_name} has been started"
            self.status_dict[instance_name] = 10
        else:
            text = f"Not enough server slots available"

        await interaction.response.send_message(text, ephemeral=True)

    @discord.ui.button(label='Refresh', style=discord.ButtonStyle.gray, custom_id='persistent_view:refresh')
    async def refresh(self, interaction: discord.Interaction, button: discord.ui.Button) -> None:
        await interaction.response.send_message("Refreshed!", ephemeral=True)
        msg = interaction.message
        instance_name = msg.embeds.pop().title.split("Server: ")[1]
        (embed, file) = await status(instance_addresses[instance_name], instance_name)
        await msg.edit(embed=embed, attachments=[file])

    # Function to initialize instance data.
    def initModule(self) -> None:
        for instance in self.bot.targets[3]["AvailableInstances"]:
            instance_name = instance["InstanceName"]
            instance_addresses[instance_name] = self.host + ":" + instance["ApplicationEndpoints"][0]["Endpoint"].split(":")[1]
            self.status_dict[instance_name] = 0

    # Function to authenticate and re-authenticate the instances.
    async def auth_instance(self, instance_name: str) -> None:
        if self.bot.instances["AMP04"][instance_name]!= None:
            b.bot_logger(self.bot.path, self.bot.name, f"Authenticated Instance: {instance_name}")
        else:
            b.bot_logger(self.bot.path, self.bot.name, f"Instance Offline: {instance_name}")

    # Function to check the status of the servers.
    async def status_check(self) -> None:
        for instance_name in self.bot.instances["AMP04"].keys():
            result = await self.bot.instances["AMP04"][instance_name].Core_GetStatusAsync()
            if "State" in result:
                self.status_dict[instance_name] = result["State"]
            else:
                self.auth_instance(instance_name)

    # Function to get the current number of online minigame servers.
    def online_count(self) -> int:
        count = 0
        for i in self.status_dict.keys():
            if self.status_dict[i] not in [0, 40]:
                count += 1
        return count

    # Function to confirm the activation of a server.
    async def confirm_server_activation(self, instance_name: str) -> bool:
        if self.online_count() < 3:
            result = (await self.bot.instances["AMP04"][instance_name].Core_StartAsync())["result"]
            if "Status" in result.keys() and result["Status"]:
                b.bot_logger(self.bot.path, self.bot.name, f"Starting Server: {instance_name}")
                return True
        else:
            b.bot_logger(self.bot.path, self.bot.name, f"Instance Failed to Start: {instance_name}")
            return False

    # Function to turn off servers after 5 min of inactivity.
    async def shutdown_inactive_servers(self) -> None:
        for instance_name in self.bot.instances["AMP04"].keys():
            if instance_name not in self.inactive_dict.keys():
                self.inactive_dict[instance_name] = 0

            java = await JavaServer.async_lookup(address=instance_addresses[instance_name], timeout=0.5)
            try:
                players = (await java.async_status()).players.online
            except:
                players = -1

            if players == 0:
                self.inactive_dict[instance_name] += 1

            if self.inactive_dict[instance_name] >= 5:
                self.inactive_dict[instance_name] = 0
                await self.bot.instances["AMP04"][instance_name].Core_StopAsync()
                b.bot_logger(self.bot.path, self.bot.name, f"Stopping Server: {instance_name}")

    @tasks.loop(minutes=1)
    async def update_status(self):
        await self.status_check()
        await self.shutdown_inactive_servers()

    @tasks.loop(minutes=1)
    async def update_manager(self):
        filename = path + "/minigame_embed_messages.json"
        if not os.path.exists(filename):
            with open(filename, "w") as f:
                f.write("{\"messages\":[]}")
                f.close()

        with open(filename) as json_file:
            messages = json.load(json_file)
            json_file.close()

        if messages["messages"] != []:
            new_messages = messages

            for i in new_messages["messages"]:
                try:
                    ids = i.split("-")
                    channel = self.bot.get_channel(int(ids[0]))
                    message = await channel.fetch_message(int(ids[1]))
                    instance_name = message.embeds.pop().title.split("Server: ")[1]
                    (embed, file) = await status(instance_addresses[instance_name], instance_name)
                    await message.edit(embed=embed, attachments=[file], view=self)
                except:
                    new_messages["messages"].remove(i)

            with open(filename, "w") as outfile:
                json.dump(new_messages, outfile, indent = 4)
                outfile.close()

    @commands.command()
    @commands.is_owner()
    async def manage_minigame(self, ctx: commands.Context, instance_name) -> None:
        """Creates an embed to check server status"""
        channel = ctx.guild.name
        author = ctx.author
        content = ctx.message.content

        self.bot.log(channel, author, content)

        (embed, file) = await status(instance_addresses[instance_name], instance_name)

        # Log the output
        self.bot.log(channel, self.bot.user, embed.description)

        await ctx.message.delete()
        channel_id = ctx.channel.id
        message_id = (await ctx.send(embed=embed, file=file, view=self)).id
        await save_message(channel_id, message_id)

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(MinigameServerManager(bot))