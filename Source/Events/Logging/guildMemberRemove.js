const { MessageEmbed, Client, GuildChannel, GuildMember } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "guildMemberRemove",
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
                            .setAuthor({name: `Member Left | ${member.user.tag}`, iconURL: `${member.displayAvatarURL({ dynamic: true })}`})
                            .setDescription(
                                `
                                ${member} (\`${member.id}\`)

                                **Joined Server:**
                                <t:${parseInt(member.joinedTimestamp / 1000)}:R>

                                **Account Created:**
                                <t:${parseInt(member.user.createdTimestamp / 1000)}:R>

                                **Event Happened:** <t:${parseInt(Date.now() / 1000)}:R>
                                `
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