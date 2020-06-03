module.exports = {
  name: "channelUpdate",
  run: async (client, oldC, newC) => {
    if (oldC.name !== newC.name) {
      const chanDatas = await client.models.guildChannel.find(
        (doc) => doc && doc.channelID === newC.id
      );
      for (const data of chanDatas) {
        const guild = client.guilds.cache.get(data.guildID);

        data.name = `${guild.name} #${newC.name}`;
        await data.save();

        for (const whData of data.subs) {
          const wh = await client
            .fetchWebhook(whData.id, whData.token)
            .catch(() => {});
          if (!wh) continue;
          wh.edit({ name: data.name });
        }
      }
    }
  },
};
