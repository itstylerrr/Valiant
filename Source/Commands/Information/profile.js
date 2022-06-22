const { CommandInteraction, MessageEmbed, Client, MessageAttachment } = require('discord.js');
const { profileImage } = require("discord-arts");

module.exports = {
    name: "profile",
    description: "Get a profile image of a user.",
    permission: "SEND_MESSAGES",
    public: true,
    options: [
        {
            name: "user",
            description: "Select a user that you want the profile of.",
            type: "USER",
            required: true
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
        const user = interaction.options.getUser("user");
        await interaction.deferReply();
        const bufferImg = await profileImage(user);
        const imgAttachment = new MessageAttachment(bufferImg, "profile.png");

        interaction.followUp({ files: [imgAttachment] });
    }
}