module.exports = {
  name: "announce",
  requiresArgs: true,
  description: "Announce a message",
  usage: "{message}",
  flags: ["embed"],
  requiredClientPerms: ["MANAGE_MESSAGES"],
  examples: ["hi there --embed", "this is cool"],
  run: async (msg, args, flags) => {
    const data = await msg.client.models.guildChannel.findOne({
      channelID: msg.channel.id,
    });
    if (!data)
      return msg.channel.send(
        new msg.client.embed().error(
          `This is not an announcement channel! Use \`${msg.client.prefix}setup\` to fix this`
        )
      );

    const content = flags["embed"]
      ? new msg.client.embed()
          .setDescription(args.join(" "))
          .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      : args.join(" ");

    await msg.client.announce(data, content);

    if (msg.deletable) await msg.delete();
    msg.channel.send(content);
  },
};
