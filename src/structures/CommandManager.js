const { Collection } = require("discord.js");
const { findNested } = require("./Util");

class CommandManager {
  constructor(client) {
    this.client = client;
    this.commands = new Collection();
  }

  load() {
    let count = 0;
    const files = findNested(this.client.commandDir);
    for (const file of files) {
      const cmd = require(file);
      if (!cmd || !cmd.run || !cmd.name) continue;

      this.commands.set(cmd.name, cmd);
      count++;
    }

    this.client.log(`Loaded ${count} commands out of ${files.length} file(s)`)
  }
}

module.exports = CommandManager;
