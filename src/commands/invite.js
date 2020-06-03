module.exports = {
  name: "invite",
  description: "Get the invite link for the bot",
  run: async (msg, args, flags) => {
    const inv = await msg.client.generateInvite([
      "SEND_MESSAGES",
      "MANAGE_CHANNELS",
      "MANAGE_WEBHOOKS",
      "MANAGE_MESSAGES",
    ]);
    msg.channel.send(
      new msg.client.embed().success(`Invite me [here](${inv})`)
    );
  },
};
