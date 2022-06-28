const { MessageEmbed, Client, GuildChannel, GuildMember } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        const guild = member.guild;

        DB.findOne({
            GuildID: guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if (!data) return;
            if (!data.guildLogs) return;
            if (data.guildLogs) {
                const chan = data.guildLogs;
                if (guild.channels.cache.has(chan)) {
                    const correctChannel = guild.channels.cache.get(chan);

                    correctChannel.send({
                        embeds: [
                            new MessageEmbed()
                            .setAuthor({name: `Member Joined | ${member.user.tag}`, iconURL: `${member.displayAvatarURL({ dynamic: true })}`})
                            .setDescription(
                                `
                                ${member} (\`${member.id}\`)

                                **Account Created:**
                                <t:${parseInt(member.user.createdTimestamp / 1000)}:R>

                                **Event Happened:** <t:${parseInt(member.joinedTimestamp / 1000)}:R>
                                `
                            )
                            .setColor("GREEN")
                        ]
                    });
                } else {
                    return;
                }
            }
        })
    },
  };