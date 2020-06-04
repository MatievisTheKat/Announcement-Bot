const ms = require("ms");

module.exports = {
  name: "ping",
  run: async (msg, args, flags) => {
    msg.channel.send(`Pinging...`).then(async (m) => {
      const msgPing = m.createdTimestamp - msg.createdTimestamp;
      const dbConnect = Date.now();

      await mongoose.connect(msg.client.mongodbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const dbDone = Date.now();

      const embed = new msg.client.embed()
        .setDescription("Pong!")
        .addField(
          "Message",
          `\`\`\`ini\n[ ${ms(msgPing, {
            long: true,
          })} ]\`\`\``,
          true
        )
        .addField(
          "Database",
          `\`\`\`ini\n[ ${ms(dbDone - dbConnect, {
            long: true,
          })} ]\`\`\``,
          true
        )
        .addField(
          "Discord",
          `\`\`\`ini\n[ ${ms(msg.client.ws.ping, {
            long: true,
          })} ]\`\`\``,
          true
        );

      m.edit("", embed);
    });
  },
};
