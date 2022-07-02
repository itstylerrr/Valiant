const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "guildIntegrationsUpdate",
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
                        type: "INTEGRATION_UPDATE",
                    });
                    const int = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);

                    return correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("🔨 Member Ban Removed")
                            .setDescription(
                                `
                                **Target Info:**
                                ${banLog.target} (\`${banLog.target}\`)
                                Bot? ${banLog.target.bot}

                                **Executor Info:**
                                ${banLog.executor} (\`${banLog.executor.id}\`)
                                Bot? ${banLog.executor.bot}
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