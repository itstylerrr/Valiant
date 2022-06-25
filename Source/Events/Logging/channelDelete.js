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
                        return correctChannel.send({
                            embeds: [
                                new MessageEmbed()
                                .setTitle("#️⃣ Channel Deleted")
                                .addFields(
                                    { name: "Channel Name:", value: `${channel.name}` },
                                    { name: "Deleted By:", value: `${chanLog.executor || "Unable to fetch."}` },
                                    { name: "Parent Name:", value: channel.parent.name, inline: true},
                                    { name: "Position:", value: `${channel.position}`, inline: true },
                                    { name: "Channel Type:", value: `${channel.type}` }
                                )
                                .setColor("RED")
                            ]
                        });
                } else {
                    return;
                }
            }
        })
    },
  };