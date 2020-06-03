const { Client } = require("discord.js");
const moment = require("moment");
const mongoose = require("mongoose");

const EventManager = require("./EventManager");
const CommandManager = require("./CommandManager");

const Embed = require("./Embed");
const Models = require("./Models");

class Bot extends Client {
  constructor(options = {}) {
    super(options);

    this.token = options.token;
    this.prefix = options.prefix;
    this.commandDir = options.commandDir;
    this.eventDir = options.eventDir;
    this.mongodbURI = options.mongodbURI;

    this.cmd = new CommandManager(this);
    this.evnt = new EventManager(this);

    this.models = Models;
    this.embed = Embed;
  }

  log(msg) {
    console.log(`[LOG ${moment().format("DD/MM/YYYY LTS")}] ${msg}`);
  }

  async init(login) {
    this.cmd.load();
    this.evnt.load();
    await this.databaseConnect();

    this.log("Successfully initialized");

    if (login) await this.login(this.token);
  }

  async databaseConnect() {
    await mongoose.connect(this.mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.log("Connected to MongoDB");
  }

  async announce(data, message) {
    for (const whData of data.subs) {
      const wh = await this.fetchWebhook(
        whData.id,
        whData.token
      ).catch(() => {});
      if (!wh) continue;
      
      await wh.send(message);
    }
  }
}

module.exports = Bot;
