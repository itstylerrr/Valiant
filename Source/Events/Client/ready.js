const { Client, WebhookClient, MessageEmbed, version } = require('discord.js');
const mongoose = require('mongoose');
const { mongoURI, webhooks, botinfo } = require("../../../Configs/main.json");
const chalk = require('chalk');
const fs = require("fs");
const os = require("os");
const osUtils = require("os-utils");
const ms = require("ms");
const { init } = require("../../Dashboard/dashboard");
let xp = require('simply-xp');

const DB = require('../../Structures/Database/Schemas/ClientDB');

/* ----------[CPU Usage]---------- */
    const cpus = os.cpus();
    const cpu = cpus[0];

    // Accumulate every CPU times values
        const total = Object.values(cpu.times).reduce(
        (acc, tv) => acc + tv, 0
    );

    // Calculate the CPU usage
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system) * 1000;
    const perc = currentCPUUsage / total * 100;

/* ----------[RAM Usage]---------- */

/**Get the process memory usage (in MB) */
async function getMemoryUsage() {
    return process.memoryUsage().heapUsed / (1024 * 1024).toFixed(2);
}

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     * @returns 
     */
    async execute(client) {
        console.log(chalk.bold(chalk.red("◜     [Details]     ◞")));
        console.log(chalk.green(chalk.bold(`${botinfo.name || "Bot"}'s Start Logging ⫸`)), chalk.white("Initializing Project..."));
        const statusArray = [
            `valiant.greezy.tk`,
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
        xp.connect(mongoURI);
        init(client);
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
        await client.manager.init(client.user.id);
        let memArray = [];

        setInterval(async () => {

            //Used Memory in GB
            memArray.push(await getMemoryUsage());

            if (memArray.length >= 14) {
                memArray.shift();
            }

            // Store in Database
            await DB.findOneAndUpdate({
                Client: true,
            }, {
                Memory: memArray,
            }, {
                upsert: true,
            });

        }, ms("5s")); //= 5000 (ms)
    }
}