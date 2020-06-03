module.exports = {
  name: "guildUpdate",
  run: async (client, oldG, newG) => {
    if (oldG.name !== newG.name) {
      const chanDatas = await client.models.guildChannel.find(
        (doc) => doc && doc.channelID === newC.id
      );
      for (const data of chanDatas) {
        const chan = client.channels.cache.get(data.channelID);
        if (!chan) {
          await data.delete();
          continue;
        }

        data.name = `${newG.name} #${chan.name} Announcements`;
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
