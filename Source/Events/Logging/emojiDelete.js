const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "emojiDelete",
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
                        type: "EMOJI_DELETE",
                    });
                    const emojiLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);
                    let changes = [];
                    emojiLog.changes.forEach(key => {
                        let str = `**Removed ${key.key}:**\n\nEmoji Name:\`\`\`${key.old || "Either removed or not set."}\`\`\``;
                        changes.push(str);
                    })
                    return correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setTitle("😔 Emoji Removed")
                            .setDescription(
                                `
                                **Emoji Info:**
                                Deleted (\`${emojiLog.target.id}\`)
                                Animated? ${emojiLog.target.animated}

                                **Executor Info:**
                                ${emojiLog.executor} (\`${emojiLog.executor.id}\`)
                                Bot? ${emojiLog.executor.bot}
                                System Message? ${emojiLog.executor.system}

                                **Changes:**

                                ${changes.join()}
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