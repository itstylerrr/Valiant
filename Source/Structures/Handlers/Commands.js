const { Perms } = require("../Validation/Permissions");
const { webhooks, botinfo } = require("../../../Configs/main.json");
const { Client, MessageEmbed, WebhookClient } = require("discord.js");
/**
 *
 * @param {Client} client
 */
module.exports = async (client, PG, chalk) => {
  const webhook = new WebhookClient({
    url: webhooks.starts,
  });

  const CommandsArray = [];
  const devCommandsArray = [];

  (await PG(`${process.cwd().replace(/\\/g, "/")}/Source/Commands/*/*.js`)).map(
    async (file) => {
      const command = require(file);

      if (!command.name) {
        if (webhooks.starts) {
          let Embed = new MessageEmbed()
            .setTitle(`${botinfo.name}'s Start Logging`)
            .setDescription(
              `**There is a command that is missing a name: ${
                file.split("/")[7]
              }**\n\nThis is not an crash error message, the bot has not crashed.`
            )
            .setColor("ORANGE");
          webhook.send({
            embeds: [Embed],
          });
          return;
        } else {
          return console.log(
            chalk.orange(`${botinfo.name}'s Start Logging >`),
            `There is a command that is missing a name: ${file.split("/")[7]}`
          );
        }
      }

      if (!command.context && !command.description) {
        if (webhooks.starts) {
          let Embed = new MessageEmbed()
            .setTitle(`${botinfo.name}'s Start Logging`)
            .setDescription(
              `**There is a command that is missing a description: ${command.name}**\n\nThis is not an crash error message, the bot has not crashed.`
            )
            .setColor("ORANGE");
          webhook.send({
            embeds: [Embed],
          });
          return;
        } else {
          return console.log(
            chalk.orange(`${botinfo.name}'s Start Logging >`),
            `There is a command that is missing a description: ${command.name}`
          );
        }
      }

      if (command.permission) {
        if (webhooks.starts) {
          if (Perms.includes(command.permission)) {
            command.defaultPermission = false;
          } else {
            let Embed = new MessageEmbed()
              .setTitle(`${botinfo.name}'s Start Logging`)
              .setDescription(
                `**There is a command with an incorrect permission: ${command.name}**\n**Given Permission:**${command.permission}\n\nThis is not an crash error message, the bot has not crashed.`
              )
              .setColor("ORANGE");
            webhook.send({
              embeds: [Embed],
            });
            return;
          }
        } else {
          return console.log(
            chalk.orange(`${botinfo.name}'s Start Logging >`),
            `There is a command with an incorrect permission: ${command.name}\nGiven Permission:${command.permission}`
          );
        }
      }
      if (command.public) {
        CommandsArray.push(command);
        if (webhooks.starts) {
          let Embed = new MessageEmbed()
            .setTitle(`${botinfo.name}'s Start Logging`)
            .setDescription(
              `**Loaded \`${command.name}\` as a public command!**`
            )
            .setColor("GREEN");
          webhook.send({
            embeds: [Embed],
          });
        } else {
          console.log(
            chalk.orange(`${botinfo.name}'s Start Logging >`),
            `Loaded ${command.name} as a public command!`
          );
        }
      } else {
        devCommandsArray.push(command);
        if (webhooks.starts) {
          let Embed = new MessageEmbed()
            .setTitle(`${botinfo.name}'s Start Logging`)
            .setDescription(
              `**Loaded \`${command.name}\` as a dev guild only command!**`
            )
            .setColor("GREEN");
          webhook.send({
            embeds: [Embed],
          });
        } else {
          console.log(
            chalk.orange(`${botinfo.name}'s Start Logging >`),
            `Loaded ${command.name} as a dev guild only command!`
          );
        }
      }
      client.commands.set(command.name, command);
    }
  );

  client.on("ready", async () => {
    client.publicCommands = CommandsArray;
    const testGuild = await client.guilds.cache.get(botinfo.testServer);
    if (testGuild) {
      await testGuild.commands.set(devCommandsArray);
    }

    let Embed = new MessageEmbed()
      .setTitle(`${botinfo.name}'s Start Logging`)
      .setDescription(
        `All correct commands have been loaded.\n\n**Public Commands:** ${client.publicCommands.size}\n**Dev Guild Only Commands:** ${client.commands.size}`
      )
      .setColor("GREEN");
    webhook.send({
      embeds: [Embed],
    });
  });
};
