module.exports = {
  name: "follow",
  requiresArgs: true,
  description: "Follow a channel using its ID",
  usage: "{channel ID}",
  requiredPerms: ["MANAGE_WEBHOOKS"],
  requiredClientPerms: ["MANAGE_WEBHOOKS"],
  examples: ["700670099853410345"],
  run: async (msg, args, flags) => {
    let failed = false;

    const chanData = await msg.client.models.guildChannel.findOne({
      channelID: args[0]
    });
    if (!chanData)
      return msg.channel.send(
        new msg.client.embed().error(
          "That is not a follow-able channel! The command to follow a specific channel will be found in its description (if it was set up)"
        )
      );

    const chan = msg.client.channels.cache.get(chanData.channelID);
    if (!chan) {
      await chanData.delete();
      return msg.channel.send(
        new msg.client.embed().error(
          "That is not a follow-able channel! The command to follow a specific channel will be found in its description (if it was set up)"
        )
      );
    }

    const previousWebhookData = await msg.client.models.webhook.findOne({
      guildID: msg.guild.id,
      channelID: msg.channel.id,
      followedChannelID: chanData.channelID
    });
    if (previousWebhookData)
      return msg.channel.send(
        new msg.client.embed().error(
          `This channel is already following **${chanData.name}**`
        )
      );

    const webhook = await msg.channel
      .createWebhook(chanData.name, {
        avatar: chanData.avatarURL,
        reason: `Followed ${chanData.name} by ${msg.author.tag}`
      })
      .catch(() => {
        failed = true;
      });
    if (failed)
      return msg.client.errors.custom(
        msg,
        msg.channel,
        `Failed to create a webhook for ${msg.channel}! Please make sure I have enough permissions and that there are less than 10 webhooks already on the channel`
      );

    const webhookData = new msg.client.models.webhook({
      guildID: msg.guild.id,
      channelID: msg.channel.id,
      followedChannelID: chanData.channelID
    });

    webhookData.id = webhook.id;
    webhookData.token = webhook.token;

    await webhookData.save();

    msg.channel.send(msg.success(`Successfully followed **${chanData.name}**`));

    chanData.subCount++;
    chanData.subs.push({
      token: webhookData.token,
      id: webhookData.id
    });
    await chanData.save();

    await chan.setTopic(
      `Followers: ${chanData.subCount} | Use \`${msg.client.prefix}follow ${chanData.channelID}\` to follow this channel!`
    );
  },
};
