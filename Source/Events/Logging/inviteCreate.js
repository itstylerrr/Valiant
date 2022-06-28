const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "inviteCreate",
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
                        type: "INVITE_CREATE",
                    });
                    const invLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);

                    return correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("🔗 Invite Created")
                            .setDescription(
                                `
                                **Invite Info:**
                                Created <t:${parseInt(invLog.createdTimestamp / 1000)}:R>
                                Expires <t:${parseInt(invLog.target.expiresTimestamp / 1000)}:R>
                                Channel: ${invLog.target.channel} (\`${invLog.target.channelId}\`)
                                Max Users: ${invLog.target.maxUses}

                                **Executor Info:**
                                ${invLog.executor} (\`${invLog.executor.id}\`)
                                Bot? ${invLog.executor.bot}

                                **Event Happened:** <t:${parseInt(invLog.createdTimestamp / 1000)}:R>
                                `
                            )
                            .setColor(guild.me.displayHexColor)
                        ]
                    })
                } else {
                    return;
                }
            }
        })
    },
  };