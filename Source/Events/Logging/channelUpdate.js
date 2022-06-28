const { MessageEmbed, Client, GuildChannel, Interaction } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "channelUpdate",
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
                        type: "CHANNEL_UPDATE",
                    });
                    const chanLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);
                    let changes = [];
                    chanLog.changes.forEach(key => {
                        let str = `**Changed ${key.key}:**\n\nOld:\`\`\`${key.old || "Could not fetch or not set."}\`\`\`\nNew:\`\`\`${key.new || "Either removed or not set."}\`\`\``;
                        changes.push(str);
                    })
                    return correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("#️⃣ Channel Updated")
                            .setDescription(
                                `
                                **Channel Info:**
                                ${chanLog.target} (\`${chanLog.target.id}\`)
                                Parent: ${chanLog.target.parent} (\`${chanLog.target.parentId}\`)
                                Position: ${chanLog.target.position} (\`${chanLog.target.rawPosition}\`)

                                **Executor Info:**
                                ${chanLog.executor} (\`${chanLog.executor.id}\`)
                                Bot? ${chanLog.executor.bot}
                                System Message? ${chanLog.executor.system}

                                **Changes:**

                                ${changes.join()}

                                **Event Happened:** <t:${parseInt(chanLog.createdTimestamp / 1000)}:R>
                                `
                            )
                            .setColor(channel.guild.me.displayHexColor)
                        ]
                    })
                } else {
                    return;
                }
            }
        })
    },
  };