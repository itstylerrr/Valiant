console.clear();
// ◜    Require Everything  ◞
const {token, music} = require("../../Configs/main.json");
const {Client, Collection} = require("discord.js");
const client = new Client({ intents: 131071 });
const {promisify} = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const ascii = require("ascii-table");
const chalk = require("chalk");
const Deezer = require("erela.js-deezer");
const Spotify = require("better-erela.js-spotify").default;
const Apple = require("better-erela.js-apple").default;
const { Manager } = require("erela.js");
const nodes = music.nodes;

// ◜    Create Collections  ◞
client.commands = new Collection();
client.events = new Collection();
client.buttons = new Collection();

// ◜    Add To Client  ◞
client.Database = require("./Database/Mongoose");
client.tools = require("../Tools/Tools");
client.logger = require("../Tools/Logger");
client.manager = new Manager({
    nodes,
    plugins: [
        new Spotify({
            clientID: music.spotify.clientId,
            clientSecret: music.spotify.clientSecret,
        }),
        new Apple(),
        new Deezer(),
    ],
    send: (id, payload) => {
        let guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});
module.exports = client;

// ◜    Require Systems  ◞
// Coming Soon...

// ◜    Require Handlers  ◞
["Events", "Commands", "Buttons"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, chalk)
});

// ◜    Login  ◞
client.login(token);