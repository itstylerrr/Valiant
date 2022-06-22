const  { CommandInteraction, MessageEmbed, Client, Message } = require('discord.js');

module.exports = {
    name: "reload",
    description: "Reload all of the bots commands for all guilds.",
    permission: "ADMINISTRATOR",
    public: false,
    options: [
    ],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client, data) {
        if (interaction.member.id !== data.config.botinfo.devId) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("🚫 Only the developer of the bot can run this command.")
                    .setColor("RED")
                ]
            });
        }
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
        await client.application.commands.set(client.publicCommands);
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle("<a:success:971880058371321877> Application commands reloaded!")
                .setDescription("This could take up to 2 hours to update.")
                .setColor("GREEN")
            ]
        });
    }
}