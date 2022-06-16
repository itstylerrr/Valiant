const { Perms } = require("../Validation/Permissions");
const { webhooks, botinfo } = require("../../../Configs/main.json");
const { Client, MessageEmbed, WebhookClient } = require("discord.js");
/**
 * 
 * @param {Client} client
 */
module.exports = async (client, PG, chalk) => {
    const webhook = new WebhookClient({
        url: webhooks.starts
    });

    CommandsArray = [];

    (await PG(`${(process.cwd().replace(/\\/g, "/"))}/Source/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name) {
            if (webhooks.starts) {
                let Embed = new MessageEmbed()
                .setTitle(`${botinfo.name}'s Start Logging`)
                .setDescription(`**There is a command that is missing a name: ${file.split('/')[7]}**\n\nThis is not an crash error message, the bot has not crashed.`)
                .setColor("ORANGE")
                webhook.send({
                    embeds: [Embed]
                });
                return;
            } else {
                return console.log(chalk.orange(`${botinfo.name}'s Start Logging >`), `There is a command that is missing a name: ${file.split('/')[7]}`);
            }
        }

        if (!command.context && !command.description) {
            if (webhooks.starts) {
                let Embed = new MessageEmbed()
                .setTitle(`${botinfo.name}'s Start Logging`)
                .setDescription(`**There is a command that is missing a description: ${command.name}**\n\nThis is not an crash error message, the bot has not crashed.`)
                .setColor("ORANGE")
                webhook.send({
                    embeds: [Embed]
                });
                return;
            } else {
                return console.log(chalk.orange(`${botinfo.name}'s Start Logging >`), `There is a command that is missing a description: ${command.name}`);
            }
        }

        if (command.permission) {
            if(webhooks.starts) {
                if(Perms.includes(command.permission)) {
                    command.defaultPermission = false;
                } else {
                    let Embed = new MessageEmbed()
                    .setTitle(`${botinfo.name}'s Start Logging`)
                    .setDescription(`**There is a command with an incorrect permission: ${command.name}**\n**Given Permission:**${command.permission}\n\nThis is not an crash error message, the bot has not crashed.`)
                    .setColor("ORANGE")
                    webhook.send({
                        embeds: [Embed]
                    });
                    return;
                }
            } else {
                return console.log(chalk.orange(`${botinfo.name}'s Start Logging >`), `There is a command with an incorrect permission: ${command.name}\nGiven Permission:${command.permission}`);
            }
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);
    });

    let Embed = new MessageEmbed()
    .setTitle(`${botinfo.name}'s Start Logging`)
    .setDescription(`All correct commands have been loaded.\n\n**Total:**${client.commands.size}`)
    .setColor("GREEN")
    webhook.send({
        embeds: [Embed]
    });

    client.on("ready", async () => {
        const testGuild = await client.guilds.cache.get(botinfo.testServer);
        testGuild.commands.set(CommandsArray);
    });
}