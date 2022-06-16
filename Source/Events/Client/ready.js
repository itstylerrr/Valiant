const { Client, WebhookClient, MessageEmbed, version } = require('discord.js');
const mongoose = require('mongoose');
const { mongoURI, webhooks, botinfo } = require("../../../Configs/main.json");
const chalk = require('chalk');
const fs = require("fs");

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        console.log(chalk.bold(chalk.red("◜     [Details]     ◞")));
        console.log(chalk.green(chalk.bold(`${botinfo.name || "Bot"}'s Start Logging ⫸`)), chalk.white("Initializing Project..."));
        const statusArray = [
            `help | ^help, WATCHING`,
            `the server for users, COMPETING`,
            `over you 😗, WATCHING`,
            `you do amazing things 💗, WATCHING`,
        ];
        const Embed = new MessageEmbed()
        .setTitle(`${botinfo}'s Start Logging`)
        .setColor("GREEN")

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
        });
        console.log(chalk.green.bold("Success!"));
        console.log(chalk.gray("Connected To"), chalk.yellow(`${client.user.tag}`));
        console.log(
          chalk.white("Watching"),
          chalk.red(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),
          chalk.white(
            `${
              client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
                ? "Users,"
                : "User,"
            }`
          ),
          chalk.red(`${client.guilds.cache.size}`),
          chalk.white(`${client.guilds.cache.size > 1 ? "Servers." : "Server."}`)
        );
        console.log(chalk.white("Loaded"), chalk.red(client.commands.size), chalk.white("commands,"), chalk.red(client.events.size), chalk.white("events."))
        console.log("");
        console.log(chalk.red.bold("◜     [Statistics]     ◞"));
        console.log(
          chalk.gray(
            `Discord.js Version: ${version}\nRunning on Node ${process.version} on ${process.platform} ${process.arch}`
          )
        );
        console.log(
          chalk.gray(
            `Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
              2
            )} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
              2
            )} MB`
          )
        );
        console.log("");
    }
}