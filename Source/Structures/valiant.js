// ◜    Require Everything  ◞
const config = require("../../Configs/main.json");
const {Client, Collection} = require("discord.js");
const client = new Client({ intents: 131071 });
const {promisify} = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const ascii = require("ascii-table");
const chalk = require("chalk");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

// ◜    Create Collections  ◞
client.commands = new Collection();

// ◜    Add To Client  ◞
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});
module.exports = client;

// ◜    Require Systems  ◞
// Coming Soon...

// ◜    Require Handlers  ◞
["Events", "Commands"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, chalk)
});

// ◜    Login  ◞
client.login(config.token);