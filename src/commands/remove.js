module.exports = {
  name: "remove",
  requiredPerms: ["MANAGE_CHANNELS"],
  usage: "{channel}",
  requiredClientPerms: ["MANAGE_CHANNELS"],
  description: "Remove the announcement feature from a channel",
  examples: ["700670099853410345"],
  requriesArgs: true,
  run: async (msg, args, flags) => {
    const chan =
      msg.mentions.channels.first() || msg.client.channels.cache.get(args[0]);
    if (!chan)
      return msg.channel.send(
        new msg.client.embed().error(
          "I could not find that channel. Please make sure you mention it or give the channel ID"
        )
      );

    const data = await msg.client.models.guildChannel.findOne({
      channelID: chan.id,
    });
    if (!data)
      return msg.channel.send(
        new msg.client.embed().error(
          "That channel is not set up as an announcement channel"
        )
      );

    const m = await msg.channel.send(
      new msg.client.embed().setDescription("Removing webhooks and data...")
    );

    const webhookDatas = await msg.client.models.webhook.find(
      (doc) => doc && doc.followedChannelID === data.channelID
    );
    for (const whData of webhookDatas) {
      const wh = await msg.client
        .fetchWebhook(whData.id, whData.token)
        .catch(() => {});
      if (wh) await wh.delete();
      await whData.delete();
    }

    await data.delete();
    await chan.setTopic("").catch(() => {});

    m.edit(
      new msg.client.embed().success(
        `${chan} is no longer an announcement channel`
      )
    );
  },
};
