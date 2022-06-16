const { Client } = require('discord.js');
const mongoose = require('mongoose');
const { mongoURI } = require("../../../Configs/main.json");

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        const statusArray = [
            `help | ^help, WATCHING`,
            `the server for users, COMPETING`,
            `over you 😗, WATCHING`,
            `you do amazing things 💗, WATCHING`,
        ];
        const logoNames = [
            `babyblue`,
            `blue`,
            `blurple`,
            `brown`,
            `cyan`,
            `darkgreen`,
            `fall`,
            `green`,
            `grey`,
            `maroon`,
            `orange`,
            `pink`,
            `piss`,
            `pride`,
            `purple`,
            `purple`,
            `red`,
            `salmon`,
            `yellow`,
        ];

        client.user.setStatus("dnd");
        setInterval(() => {
            const random = statusArray[Math.floor(Math.random() * statusArray.length)].split(", ");
            const status = random[0];
            const mode = random[1];
            client.user.setActivity(status, {type: mode});
        }, 10000);
        if(!mongoURI) return;
        mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch((err) => {
            console.log(`Mongo Error: ${err}`);
        })
    }
}