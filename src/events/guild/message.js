module.exports = {
  name: "message",
  run: async (client, msg) => {
    if (!msg.guild || msg.author.bot || msg.author.webhookID) return;

    if (msg.content.toLowerCase().startsWith(client.prefix.toLowerCase())) {
      let [cmd, ...args] = msg.content
        .slice(client.prefix.length)
        .trim()
        .split(/ +/gi);

      const flags = {};
      const flagArgs = args.filter((a) => a.startsWith("--"));
      flagArgs.map((flag) => (flags[flag] = true));
      args = args.filter((a) => !a.startsWith("--"));

      const command = client.cmd.commands.get(cmd.toLowerCase());
      if (command) {
        const requiredPerms = command.requiredPerms || ["SEND_MESSAGES"];
        const requiredClientPerms = command.requiredClientPerms || [
          "SEND_MESSAGES",
        ];

        if (!msg.guild.me.hasPermission("SEND_MESSAGES"))
          return msg.author.send(
            new client.embed().error(
              `You tried to use \`${command.name}\` in **${msg.guild.name}** (${msg.channel}) but I cannot send messages there! Speak to a server admin to fix this`
            )
          );

        if (!msg.member.hasPermission(requiredPerms))
          return msg.channel.send(
            new client.embed().error(
              `You are missing the ${requiredPerms.join(
                ", "
              )} permission(s) to run that command!`
            )
          );

        if (!msg.guild.me.hasPermission(requiredClientPerms))
          return msg.channel.send(
            new client.embed().error(
              `I am missing the ${requiredClientPerms.join(
                ", "
              )} permission(s) to run that command`
            )
          );

        if (command.requiresArgs && !args[0])
          return require("../../commands/help").run(msg, [command.name], flags);

        command.run(msg, args, flags);
      }
    } else {
      if (msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        msg.channel
          .send(
            `Hey there! I am **${client.user.tag}**! To get started just type \`${client.prefix}help\`!`
          )
          .then((m) => m.delete({ timeout: 20000 }));
      }
    }

    const chanData = await client.models.guildChannel.findOne({
      channelID: msg.channel.id,
    });
    if (chanData && chanData.autoAnnounce) {
      await client.announce(chanData, msg.content);
    }
  },
};
