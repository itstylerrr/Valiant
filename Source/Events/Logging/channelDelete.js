const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "channelDelete",
    /**
     *
     * @param {GuildChannel} channel
     * @param {Client} client
     */
    async execute(channel, client) {
        const guild = channel.guild;

        DB.findOne({
            GuildID: guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if (!data) return;
            if (!data.guildLogs) return;
            if (data.guildLogs) {
                const chan = data.guildLogs;
                if (guild.channels.cache.has(chan)) {
                    const fetchedLogs = await guild.fetchAuditLogs({
                        limit: 1,
                        type: "CHANNEL_DELETE",
                    });
                    const chanLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);
                    if (channel.parent) {
                        return correctChannel.send({
                            embeds: [
                                new MessageEmbed()
                                .setTitle("#️⃣ Channel Created")
                                .addFields(
                                    { name: "Channel Name:", value: `${channel.name} (${channel})` },
                                    { name: "Created By:", value: `${chanLog.executor || "Unable to fetch."}` },
                                    { name: "Parent Name:", value: channel.parent.name || "Channel is a Parent", inline: true},
                                    { name: "Position:", value: `${channel.position}` },
                                    { name: "Channel Type:", value: `${channel.type}` },
                                    { name: "Event Took Place:", value: `<t:${parseInt(chanLog.createdTimestamp / 1000)}:R>` }
                                )
                                .setColor("GREEN")
                            ]
                        });
                    } else if (channel.type === "GUILD_CATEGORY") {
                        return correctChannel.send({
                            embeds: [
                                new MessageEmbed()
                                .setTitle("#️⃣ Channel Deleted")
                                .addFields(
                                    { name: "Channel Name:", value: `${channel.name}` },
                                    { name: "Deleted By:", value: `${chanLog.executor || "Unable to fetch."}` },
                                    { name: "Parent Name:", value: "Channel was a parent.", inline: true},
                                    { name: "Position:", value: `Deleted`, inline: true },
                                    { name: "Channel Type:", value: `${channel.type}` },
                                    { name: "Event Took Place:", value: `<t:${parseInt(chanLog.createdTimestamp / 1000)}:R>` }
                                )
                                .setColor("RED")
                            ]
                        });
                    }
                } else {
                    return;
                }
            }
        })
    },
  };