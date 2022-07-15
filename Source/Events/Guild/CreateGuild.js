const { Client, Guild, MessageEmbed, WebhookClient } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Guild");
const automodDb = require("../../Structures/Database/Schemas/ModerationDB");
const { webhooks, botinfo } = require("../../../Configs/main.json");
const srcBin = require("sourcebin");

module.exports = {
    name: "guildCreate",
    once: false,
    /**
     * @param {Client} client 
     * @param {Guild} guild
     */

    async execute(guild, client) {
        const hook = new WebhookClient({
            url: webhooks.joins
        });

        hook.send({
            embeds: [
                new MessageEmbed()
                .setTitle(" | Valiant Joined a New Guild! | ")
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
                .setColor("GREEN")
            ]
        });
        try { 
            let guildData = await client.Database.fetchGuild(guild.id);
            let loggingData = await client.Database.fetchGuildsLogging(guild.id);
            const dev = client.users.cache.get(botinfo.devId);
            const newGuildFromDB = client.guilds.cache.get(guildData.id);



            if (dev) {
                dev.send({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(" | Valiant Joined a New Guild! | ")
                        .setAuthor(newGuildFromDB.name, guild.iconURL({ dynamic: true }))
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
                        .setColor("GREEN")
                    ]
                })
            }
            let modData = await automodDb.findOne({
                GuildID: guild.id
            });
            if (!modData) {
                automodDb.create({
                    GuildID: guild.id
                });
            }
            const bin = await srcBin.create(`${modData}\n\n${guildData}\n\n${loggingData}`)
            dev.send({
                content: [
                    `
                    check info here: ${bin.url}
                    `
                ]
            });
            guild.members.cache.get(guild.ownerId)?.send({ embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Hey 👋, thanks for inviting me to your server!")
                .setDescription("If you need help setting me up check out the docs at | https://docs.tyler.cf |.")
            ]})
        } catch(err) {};
    },
};