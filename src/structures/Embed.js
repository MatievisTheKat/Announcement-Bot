const { MessageEmbed } = require("discord.js");

class Embed extends MessageEmbed {
  constructor(...args) {
    super(...args);

    this.setColor("BLUE");
  }

  error(msg) {
    return this.setColor("RED").setDescription(msg);
  }

  success(msg) {
    return this.setColor("GREEN").setDescription(msg);
  }
}

module.exports = Embed;
