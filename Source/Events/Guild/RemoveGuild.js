const { Client, Guild, MessageEmbed, WebhookClient } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Guild");
const { webhooks } = require("../../../Configs/main.json");

module.exports = {
    name: "guildDelete",
    once: false,
    /**
     * @param {Client} client 
     * @param {Guild} guild
     */

    async execute(guild, client) {
        DB.findOneAndDelete({
            id: guild.id
        });

        const hook = new WebhookClient({
            url: webhooks.leaves
        });

        hook.send({
            embeds: [
                new MessageEmbed()
                .setTitle(" | Valiant Left Guild! | ")
                .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
                .addFields(
                  { name: "Guild Name:", value: guild.name, inline: true },
                  { name: "Guild Members:", value: `${guild.memberCount} members.`, inline: true },
                  {
                      name: "Client Total Users:",
                      value:
                        `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users.`,
                    },
                    
                    { name: "Total Guild Count:", value: `${client.guilds.cache.size} guilds.` },
                    { name: "Timestamp:", value: `<t:${parseInt(guild.joinedTimestamp / 1000)}:R>`}
                )
                .setColor("RED")
            ]
        });
    },
};