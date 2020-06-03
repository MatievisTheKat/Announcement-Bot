module.exports = {
  name: "help",
  usage: "<command>",
  description: "View this bot's commands or get help on a specific one",
  examples: ["announce", "", "follow"],
  run: async (msg, args, flags) => {
    const embed = new msg.client.embed();

    if (args[0]) {
      const command = msg.client.cmd.commands.get(args[0].toLowerCase());
      if (!command)
        return msg.channel.send(
          new msg.client.embed().error(
            "Seems like I couldn't find that command"
          )
        );

      embed
        .setAuthor(command.name)
        .setDescription(
          `**Description:** ${
            command.description || "No description"
          }\n**Required Permissions:** ${
            command.requiredPerms
              ? command.requiredPerms
                  .join("\n")
                  .toLowerCase()
                  .replace(/_/gi, "-")
              : "send messages"
          }\n**Required Client Permissions:** ${
            command.requiredClientPerms
              ? command.requiredClientPerms
                  .join("\n")
                  .toLowerCase()
                  .replace(/_/gi, "-")
              : "send messages"
          }\n**Flags:** ${
            command.flags ? command.flags.join(", ") : "None"
          }\n**Examples:**\n${
            command.examples
              ? command.examples
                  .map((ex) => `- ${msg.client.prefix}${command.name} ${ex}`)
                  .join("\n")
              : "None"
          }`
        );
    } else {
      embed.setDescription(
        msg.client.cmd.commands.map((c) => `\`${c.name}\``).join(", ")
      );
    }

    msg.channel.send(embed);
  },
};
