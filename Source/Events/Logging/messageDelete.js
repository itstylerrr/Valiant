const { MessageEmbed, Client, GuildChannel, Message } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "messageDelete",
    /**
     *
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const guild = message.guild;
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
                        type: "MESSAGE_DELETE",
                    });
                    const msgLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);

                    return correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("💬 Message Deleted")
                            .setDescription(
                                `
                                **Message Info:**
                                Author: ${msgLog.target} (\`${msgLog.target.id}\`)
                                Channel: ${msgLog.extra.channel} (\`${msgLog.extra.channel.id}\`)
                                Bot? ${msgLog.target.bot}
                                **Text:**\`\`\`${message.content || "Could not find message content."}\`\`\`

                                **Executor Info:**
                                ${msgLog.executor} (\`${msgLog.executor.id}\`)
                                Bot? ${msgLog.executor.bot}

                                **Event Happened:** <t:${parseInt(msgLog.createdTimestamp / 1000)}:R>
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