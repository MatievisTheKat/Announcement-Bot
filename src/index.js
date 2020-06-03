require("dotenv").config();
const { join } = require("path");

const Bot = require("./structures/Client");
const client = new Bot({
  token: process.env.TOKEN,
  mongodbURI: process.env.MONGODB_URI,
  prefix: "a.",
  commandDir: join(__dirname, "commands"),
  eventDir: join(__dirname, "events"),
});
client.init(true);
