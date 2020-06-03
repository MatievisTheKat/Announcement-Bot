const { model, Schema } = require("mongoose");

const guildChannel = model(
  "guild_channels",
  new Schema({
    guildID: String,
    channelID: String,
    subCount: Number,
    subs: [Object],
    autoAnnounce: Boolean,
    name: String,
    avatarURL: String,
  })
);

const guildChannels = model(
  "all_guild_channels",
  new Schema({
    clientID: String,
    channels: [String],
  })
);

const webhook = model(
  "wehooks",
  new Schema({
    token: String,
    id: String,
    channelID: String,
    guildID: String,
    followedChannelID: String,
  })
);

module.exports = { guildChannels, guildChannel, webhook };
