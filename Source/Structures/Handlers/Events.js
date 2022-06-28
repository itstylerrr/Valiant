const { Events } = require("../Validation/EventNames");
const { webhooks, botinfo } = require("../../../Configs/main.json");
const ascii = require("ascii-table");

module.exports = async (client, PG, chalk) => {
    const Table = new ascii("Events Loaded");
    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/Source/Events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (event.name) {
            if (!Events.includes(event.name)) {
                const L = file.split("/")
                return Table.addRow(event.name || L[L.length - 2]/L[L.length - 1], "✖")
            }
        }

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await Table.addRow(event.name, "✔ SUCCESSFUL")
        client.events.set(event);
    });
}