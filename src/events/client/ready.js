module.exports = {
  name: "ready",
  run: async (client) => {
    const channels = await client.models.guildChannel.find();
    const webhooks = await client.models.webhook.find();

    client.user.setPresence({
      activity: {
        name: `${client.prefix}help | ${client.guilds.cache.size} servers | ${channels.length} announcement channels | ${webhooks.length} following channels`,
        type: "WATCHING"
      },
      status: "online",
    });

    client.log(`Logged in as ${client.user.tag}`);
  },
};
