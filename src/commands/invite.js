module.exports = {
  name: "invite",
  run: async (msg, args, flags) => {
    const inv = await msg.client.generateInvite(["SEND_MESSAGES", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "MANAGE_MESSAGES"]);
    msg.channel.send(new msg.client.embed().success(`Invite me [here](${inv})`))
  },
};
