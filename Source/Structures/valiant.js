console.clear();
// ◜    Require Everything  ◞
const config = require("../../Configs/main.json");
const {Client, Collection} = require("discord.js");
const client = new Client({ intents: 131071 });
const {promisify} = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const ascii = require("ascii-table");
const chalk = require("chalk");

// ◜    Create Collections  ◞
client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();

// ◜    Add To Client  ◞
client.Database = require("./Database/Mongoose");
client.tools = require("../Tools/Tools");
client.logger = require("../Tools/Logger");
module.exports = client;

// ◜    Require Systems  ◞
// Coming Soon...

// ◜    Require Handlers  ◞
["Events", "Commands", "Buttons"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, chalk)
});

// ◜    Login  ◞
client.login(config.token);