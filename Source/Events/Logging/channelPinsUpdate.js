const { MessageEmbed, Client, GuildChannel } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "channelPinsUpdate",
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
                        type: "MESSAGE_PIN",
                    });
                    const msgLog = fetchedLogs.entries.first();
                    const correctChannel = guild.channels.cache.get(chan);
                    const pinedMsg = await msgLog.extra.channel.messages.fetch(msgLog.extra.messageId);
                    const Embed = new MessageEmbed()
                    .setTitle("📌 Message Pin Updated")
                    .addFields(
                        { name: "Channel Name:", value: `${msgLog.extra.channel.name} (${msgLog.extra.channel})` },
                        { name: "Pinned By:", value: `${msgLog.executor || "Unable to fetch."} (\`${msgLog.executor.id}\`)` },
                        { name: "Content;", value: `${pinedMsg.content || "No content, message is either an image or an embed."}` },
                        { name: "URL:", value: `[go to](https://discord.com/channels/${pinedMsg.guildId}/${pinedMsg.channelId}/${pinedMsg.id})` },
                        { name: "Message Created:", value: `<t:${parseInt(pinedMsg.createdTimestamp / 1000)}:R>` },
                        { name: "Author Data:", value: `<@${pinedMsg.author.id || "System Message"}> (\`${pinedMsg.author.id || "System Message"}\`)\n**Bot?** ${pinedMsg.author.bot}` }
                    )
                    .setDescription(`If there were embeds or attachments sent with the message, they will be sent below this message.`)
                    .setColor("GREEN")
                    .setFooter(`Logging by ${guild.me.displayName} | /invite`)
                    if (pinedMsg.pinned === false) {
                        Embed.addField("📌 Pin Status:", "removed")
                    } else if (pinedMsg.pinned === true) {
                        Embed.addField("📌 Pin Status:", "added")
                    }
                    correctChannel.send({
                        embeds: [Embed]
                    });
                        if (pinedMsg.embeds) {
                            pinedMsg.embeds.forEach(embed => {
                                correctChannel.send({
                                    content: `This embed was attached to the previous updated pinned message.`,
                                    embeds: [embed]
                                })
                            });
                        }

                        if (pinedMsg.attachments) {
                            pinedMsg.attachments.forEach(attachment => {
                                let attach = attachment.url;
                                correctChannel.send({
                                    content: `This attachment was attached to the previous updated pinned message.`,
                                    files: [attach]
                                })
                            })
                        }
                } else {
                    return;
                }
            }
        })
    },
  };