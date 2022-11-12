from discord.ext import commands, tasks

import os

import bot_library as b

class WatchFerret(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.status_dict = {}

    async def auth_instance(self, target_name:str, instance_name: str) -> None:
        if self.bot.instances[target_name][instance_name]!= None:
            b.bot_logger(self.bot.path, self.bot.name, f"Authenticated Instance: {instance_name}")
        else:
            b.bot_logger(self.bot.path, self.bot.name, f"Instance Offline: {instance_name}")

    @tasks.loop(minutes=5)
    async def get_status(self):
        for target_name in self.bot.instances.keys():
            for instance_name in self.bot.instances[target_name].keys():
                if self.bot.instances[target_name][instance_name] != None:
                    result = await self.bot.instances[target_name][instance_name].Core_GetStatusAsync()

                    if instance_name not in self.status_dict.keys():
                        self.status_dict[instance_name] = 0

                    if "State" in result:
                        status = result["State"]
                    else:
                        status = 0
                        self.auth_instance(target_name, instance_name)

                    if status == 30:
                        self.status_dict[instance_name] += 1

                    if self.status_dict[instance_name] >= 2:
                        b.bot_logger(self.bot.path, self.bot.name, f"WatchFerret Event Detected: {instance_name}")
                        await self.bot.instances[target_name][instance_name].Core_KillAsync()
                        await self.bot.instances[target_name][instance_name].Core_StartAsync()
                        b.bot_logger(self.bot.path, self.bot.name, f"Instance Has Been Rescued: {instance_name}")

async def setup(bot: commands.bot) -> None:
    await bot.add_cog(WatchFerret(bot))