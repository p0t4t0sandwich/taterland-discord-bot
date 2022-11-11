#!/usr/bin/python3

from discord.ext import commands, tasks

import os

import bot_library as b
from ampapi_handler_async import AMPAPIHandlerAsync

class ModdedServerManager(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.target = None
        self.instances_dict = {}
        self.status_dict = {}

    # Function to authenticate and re-authenticate the instances.
    async def auth_instances(self):
        self.target = self.bot.targets[2]

        for instance in self.target["AvailableInstances"]:
            instance_module = instance["Module"]
            instance_id = instance["InstanceID"]

            if instance_module == "Minecraft":
                instance_name = instance["InstanceName"]

                InstanceAPI = await self.bot.ADS.InstanceLoginAsync(instance_id=instance_id)

                if InstanceAPI != None:
                    b.bot_logger(self.bot.path, self.bot.name, f"Initialized Instance: {instance_name}")
                    await InstanceAPI.LoginAsync()

                    self.instances_dict[instance_name] = InstanceAPI
                    self.status_dict[instance_name] = 0

                else:
                    b.bot_logger(self.bot.path, self.bot.name, f"Instance Offline: {instance_name}")

    # Function to check the status of the servers.
    async def status_check(self) -> None:
        for i in self.instances_dict.keys():
            self.status_dict[i] = (await self.instances_dict[i].Core_GetStatusAsync())["State"]

    # Function to get the current number of online modded servers.
    async def online_count(self) -> int:
        count = 0
        for i in self.status_dict.keys():
            if self.status_dict[i] not in [0, 40]:
                count += 1
        return count

    # Function to confirm the activation of a server.
    async def confirm_server_activation(self, instance_name: str) -> bool:
        if await self.online_count() < 2:
            await self.instances_dict[instance_name].Core_StartAsync()
            return True
        else:
            return False

    @tasks.loop(minutes=1)
    async def task(self):
        try:
            await self.status_check()
        except:
            await self.auth_instances()

    @commands.command()
    @commands.is_owner()
    async def start(self, ctx: commands.Context, *args) -> None:
        if args[0] in self.instances_dict:
            status = await self.confirm_server_activation(args[0])
            if status:
                await ctx.send(f"Server {args[0]} has been started")
            else:
                await ctx.send(f"Not enough server slots available")
        else:
            await ctx.send(f"Instance does not exist")

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(ModdedServerManager(bot))