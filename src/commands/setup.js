module.exports = {
  name: "setup",
  description: "Set up a follow-able channel in the current server",
  requiredPerms: ["MANAGE_GUILD"],
  requiredClientPerms: ["MANAGE_WEBHOOKS", "MANAGE_CHANNELS"],
  run: async (msg, args, flags) => {
    const col = await msg.channel.createMessageCollector(
      (m) => m.author.id === msg.author.id,
      { time: 5 * 60 * 1000 }
    );

    const totalCount = 2;
    let count = 0;
    let complete = false;
    let chan;

    const embed = new msg.client.embed()
      .setDescription("What channel would you like setup?")
      .setFooter(
        `This times out in 5 minutes | Type 'cancel' to quit | Step ${count}/${totalCount}`
      );

    const m = await msg.channel.send(embed);

    const data = new msg.client.models.guildChannel({
      guildID: msg.guild.id,
      subCount: 0,
      subs: [],
    });
    const guildData =
      (await msg.client.models.guildChannels.findOne({
        guildID: msg.guild.id,
      })) ||
      new msg.client.models.guildChannels({
        guildID: msg.guild.id,
        channels: [],
      });

    col.on("collect", async (message) => {
      if (/cancel|cancle/gi.test(message.content)) return col.stop();

      switch (count) {
        case 0:
          chan = message.mentions.channels.first();
          if (!chan)
            return message.channel
              .send(
                new msg.client.embed().error(
                  "That is not a valid channel mention"
                )
              )
              .then((m) => m.delete({ timeout: 10 * 1000 }).catch(() => {}));

          if (guildData.channels.includes(chan.id))
            return message.channel
              .send(
                new msg.client.embed().error(
                  "That channel is already set up in this server! Pick another one"
                )
              )
              .then((m) => m.delete({ timeout: 10 * 1000 }).catch(() => {}));

          data.channelID = chan.id;
          data.name = `${msg.guild.name} #${chan.name} Announcements`;
          data.avatarURL = msg.guild.iconURL();
          guildData.channels.push(chan.id);

          message.channel.send(
            embed.setDescription(
              `Would you like all messages sent in ${chan} to be automatically announced? (yes/no)\nIf no, you can use the \`${msg.client.prefix}announce\` command in that channel`
            )
          );
          count++;
          break;
        case 1:
          const yes = /yes/i.test(message.content);
          const no = /no/i.test(message.content);
          if (!yes && !no)
            return message.channel
              .send(
                new msg.client.embed().error(
                  'That is not a valid answer! Please send either "yes" or "no"'
                )
              )
              .then((m) => m.delete({ timeout: 10 * 1000 }).catch(() => {}));

          data.autoAnnounce = yes ? true : false;

          complete = true;
          col.stop();
          break;
        default:
          col.stop();
      }
    });

    col.on("end", async (collected) => {
      if (!complete) return m.edit(embed.error("Timed out"));
      else {
        await data.save();
        await guildData.save();

        await chan.setTopic(
          `Followers: ${data.subCount} | Use \`${msg.client.prefix}follow ${data.channelID}\` to follow this channel!`
        );

        msg.channel.send(
          embed.success(
            `${chan} is now follow-able by using \`${msg.client.prefix}follow ${chan.id}\``
          )
        );
      }
    });
  },
};
