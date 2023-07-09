


function logger(platform: string, channelId: string, userId: string, message: string): void {
    message = message.replace(/\n/g, "\\n");
    console.log(`[${new Date().toISOString()}] [Bee Name Generator] [${platform}] [${channelId}] [${userId}]: ${message}`);
}