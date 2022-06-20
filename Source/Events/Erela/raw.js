const client = require("../../Structures/valiant");

client.on("raw", (d) => client.manager.updateVoiceState(d));