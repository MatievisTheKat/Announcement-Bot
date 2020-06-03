module.exports = {
  name: "unfollow",
  description: "Un-Follow a channel using its ID",
  requiredPerms: ["MANAGE_WEBHOOKS"],
  usage: "{channel ID}",
  requiredClientPerms: ["MANAGE_WEBHOOKS"],
  examples: ["700670099853410345"],
  run: async (msg, args, flags) => {
    const chanData = await msg.client.models.guildChannel.findOne({
      channelID: args[0],
    });
    if (!chanData)
      return msg.channel.send(
        new msg.client.embed().error(
          `That channel is not an announcement channel`
        )
      );

    const chan = msg.client.channels.cache.get(chanData.channelID);
    if (!chan) {
      await chanData.delete();
      return msg.channel.send(
        new msg.client.embed().error(
          `**${chanData.name}** not longer exists. You will have to delete the webhook manually`
        )
      );
    }

    const previousWebhookData = await msg.client.models.webhook.findOne({
      guildID: msg.guild.id,
      channelID: msg.channel.id,
      followedChannelID: chanData.channelID,
    });
    if (!previousWebhookData)
      return msg.channel.send(
        new msg.client.embed().error(
          `This channel not following **${chanData.name}**`
        )
      );

    const webhookData = await msg.client.models.webhook.findOne({
      guildID: msg.guild.id,
      channelID: msg.channel.id,
      followedChannelID: chanData.channelID,
    });

    const webhook = await msg.client.fetchWebhook(
      webhookData.id,
      webhookData.token
    );
    if (webhook) await webhook.delete();

    await webhookData.delete().catch(() => {});

    chanData.subCount--;
    chanData.subs.splice(
      chanData.subs.indexOf({
        token: webhookData.token,
        id: webhookData.id,
      }),
      1
    );
    await chanData.save();

    await chan.setTopic(
      `Followers: ${chanData.subCount} | Use \`${msg.client.prefix}follow ${chanData.channelID}\` to follow this channel!`
    );

    msg.channel.send(
      new msg.client.embed().success(
        `Successfully unfollowed **${chanData.name}**`
      )
    );
  },
};
