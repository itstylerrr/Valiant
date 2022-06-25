const  { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "logging",
    description: "Select a channel for logging, to remove, run without options.",
    permission: "ADMINISTRATOR",
    public: true,
    options: [
        {
            name: "options",
            description: "Choost what loggs you want to have enabled.",
            type: "STRING",
            choices: [
                { name: "🕴️ Member Logs", value: "member" },
                { name: "⚒️ Mod Logs", value: "mod" },
                { name: "🏢 Guild Logs", value: "guild" },
                { name: "✅ All Logs", value: "all" },
            ]
        },
        {
            name: "channel",
            description: "Select a channel that you want logs to be sent to.",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"]
        }
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
        let channel = interaction.options.getChannel("channel");
        if (!channel && interaction.options.getString("options")) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("<:fail:971881490512216104> You must mention a channel to set up logging.")
                    .setColor("RED")
                ]
            });
        }

        if (channel && !interaction.options.getString("options")) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("<:fail:971881490512216104> You must select a option to set up logging.")
                    .setColor("RED")
                ]
            });
        }

        if (!channel) {
            data.logging.memberLogs = null;
            data.logging.modLogs = null;
            data.logging.guildLogs = null;
            data.logging.markModified();
            data.logging.save();
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("<a:success:971880058371321877> Logging has been removed from the guild.")
                    .setColor("GREEN")
                ]
            });
        }

        switch (interaction.options.getString("options")) {
            case "member" : {
                data.logging.memberLogs = channel.id;
                data.logging.markModified();
                data.logging.save();
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("<a:success:971880058371321877> Member logging has been enabled for the guild.")
                        .setColor("GREEN")
                    ]
                });
            }

            case "mod" : {
                data.logging.modLogs = channel.id;
                data.logging.markModified();
                data.logging.save();
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("<a:success:971880058371321877> Mod logging has been enabled for the guild.")
                        .setColor("GREEN")
                    ]
                });
            }

            case "guild" : {
                data.logging.guildLogs = channel.id;
                data.logging.markModified();
                data.logging.save();
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("<a:success:971880058371321877> Guild logging has been enabled for the guild.")
                        .setColor("GREEN")
                    ]
                });
            }
            
            case "all" : {
                data.logging.memberLogs = channel.id;
                data.logging.modLogs = channel.id;
                data.logging.guildLogs = channel.id;
                data.logging.markModified();
                data.logging.save();
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle("<a:success:971880058371321877> All logging has been enabled for the guild.")
                        .setColor("GREEN")
                    ]
                });
            }
        }
    }
}