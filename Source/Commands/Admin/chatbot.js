const  { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "chatbot",
    description: "Select a channel for chatbot to interact in, to remove, run without options.",
    permission: "ADMINISTRATOR",
    public: true,
    options: [
        {
            name: "channel",
            description: "Select a channel that you want the chatbot to interact in.",
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
        const channel = interaction.options.getChannel("channel");
        if (!channel) {
            data.guild.addons.settings.cbChId = null;
            data.guild.markModified("addons.settings");
            data.guild.save();
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("<a:success:971880058371321877> The chatbot has been removed from the guild.")
                    .setColor("GREEN")
                ]
            });
        } else if (channel) {
            data.guild.addons.settings.cbChId = channel.id;
            data.guild.markModified("addons.settings");
            await data.guild.save();
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("<a:success:971880058371321877> The chatbot has been enabled for this server.")
                    .setDescription(`Channel: ${channel}`)
                    .setColor("GREEN")
                ]
            });
        }
    }
}