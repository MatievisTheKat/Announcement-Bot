const { findNested } = require("./Util");

class EventManager {
  constructor(client) {
    this.client = client;
  }

  load() {
    let count = 0;
    const files = findNested(this.client.eventDir);
    for (const file of files) {
      const evnt = require(file);
      if (!evnt || !evnt.run || !evnt.name) continue;

      this.client.on(evnt.name, evnt.run.bind(null, this.client));
      count++;
    }

    this.client.log(`Loaded ${count} events out of ${files.length} file(s)`);
  }
}

module.exports = EventManager;
