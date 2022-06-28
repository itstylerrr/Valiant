const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "emojiCreate",
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
                        type: "EMOJI_CREATE",
                    });
                    const emojiLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);
                    let changes = [];
                    emojiLog.changes.forEach(key => {
                        let str = `**Added ${key.key}:**\n\nEmoji Name:\`\`\`${key.new || "Either removed or not set."}\`\`\``;
                        changes.push(str);
                    })
                    return correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("😀 Emoji Created")
                            .setDescription(
                                `
                                **Emoji Info:**
                                ${emojiLog.target} (\`${emojiLog.target}\`)
                                Animated? ${emojiLog.target.animated}

                                **Executor Info:**
                                ${emojiLog.executor} (\`${emojiLog.executor.id}\`)
                                Bot? ${emojiLog.executor.bot}
                                System Message? ${emojiLog.executor.system}

                                **Changes:**

                                ${changes.join()}

                                **Event Happened:** <t:${parseInt(emojiLog.createdTimestamp / 1000)}:R>
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