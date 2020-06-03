module.exports = {
  name: "ready",
  run: (client) => client.log(`Logged in as ${client.user.tag}`),
};
