module.exports = {
  name: "channelDelete",
  run: async (client, channel) => {
    const chanData = await client.models.guildChannel.findOne({
      channelID: channel.id,
    });
    if (chanData) {
      const followers = await client.models.webhook.find(
        (doc) => doc.followedChannelID === channel.id
      );

      for (const follower of followers) {
        const webhook = await client.fetchWebhook(follower.id, follower.token);

        await webhook.delete();
        await follower.delete();
      }

      await chanData.delete();
    }
  },
};
