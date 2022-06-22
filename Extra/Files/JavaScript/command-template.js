const  { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "name",
    description: "description",
    permission: "permission",
    public: false,
    options: [
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        // ⟬                    Logging                    ⟭

        if (data.guild.addons.settings.loggingId) {
            let log = client.channels.cache.get(data.guild.addons.settings.loggingId);
            let logEmbed = new MessageEmbed()
            .setTitle(`${interaction.guild.name}'s Command Logging`)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setDescription(`**This is an automated message sent by <@${client.user.id}>**`)
            .addFields(
                { name: "Command Name:", value: `${data.cmd.name}` },
                { name: "Ran By:", value: `${interaction.user}` },
                { name: "Timestamp:", value: `<t:${parseInt(interaction.createdTimestamp / 1000)}:R>` }
            )
            .setColor("BLURPLE")
            .setFooter(`Invite ${data.config.botinfo.name}`)

            log.send({
                embeds: [logEmbed]
            });
        }

        // ⟬                    Command                    ⟭
        return interaction.reply({content: "you suck at this"})
    }
}