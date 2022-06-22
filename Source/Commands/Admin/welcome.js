const  { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: "welcome",
    description: "Configure the welcome messages for the guild.",
    permission: "ADMINISTRATOR",
    public: true,
    options: [
        {
            name: "enabled",
            description: "Enable or disable the welcome messages.",
            type: "STRING",
            choices: [
                { name: "✅ Yes", value: "true"},
                { name: "🚫 No", value: "false" }
            ],
            required: true,
        },
        {
            name: "channel",
            description: "The channel that the welcome messages will be sent to.",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"]
        },
        {
            name: "message",
            description: "The message for the welcome messages. Check GitHub for variables.",
            type: "STRING",
        },
        {
            name: "embed",
            description: "Enable or disable the embed for the welcome messages.",
            type: "STRING",
            choices: [
                { name: "✅ Yes", value: "embed-true"},
                { name: "🚫 No", value: "embed-false" }
            ],
        },
        {
            name: "role",
            description: "Select a role to be added to a user when they join the guild.",
            type: "ROLE"
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
        const { options } = interaction;
        const channel = options.getChannel("channel");
        const message = options.getString("message");
        const embed = options.getString("embed");
        const role = options.getRole("role");
        const Embed = new MessageEmbed()
        .setTitle("<a:success:971880058371321877> Welcome Settings Updated")
        .setColor("GREEN")

        if (options.getString("enabled") === "false") {
            data.guild.addons.welcome.enabled = false
            data.guild.markModified("addons.welcome");
            await data.guild.save();
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("<a:success:971880058371321877> Welcome messages have been disabled in the guild.")
                    .setColor("GREEN")
                ]
            });
        } else if (options.getString("enabled") === "true") {
            data.guild.addons.welcome.enabled = true
            data.guild.markModified("addons.welcome");
            await data.guild.save();
            Embed.addField("Enabled:", options.getString("enabled"));
        }

        if (channel) {
            data.guild.addons.welcome.channel = channel.id;
            data.guild.markModified("addons.welcome");
            await data.guild.save();
            Embed.addField("Channel:", `${channel}`);
        }

        if (message) {
            if (message.length > 1024) {
                Embed.addField("Message:", "Your message was longer than 1024 characters. Please try again.")
            } else if (message.length < 1025) {
                data.guild.addons.welcome.message = message;
                data.guild.markModified("addons.welcome");
                await data.guild.save();
                Embed.addField("Message:", `${message}`);
            }
        }

        if (embed === "embed-false") {
            data.guild.addons.welcome.embed = false
            data.guild.markModified("addons.welcome");
            await data.guild.save();
            Embed.addField("Embed:", `${embed}`);
        } else if (embed === "embed-true") {
            data.guild.addons.welcome.embed = true
            data.guild.markModified("addons.welcome");
            await data.guild.save();
            Embed.addField("Embed:", `${embed}`);
        }

        if (role) {
            data.guild.addons.welcome.role = role.id;
            data.guild.markModified("addons.welcome");
            await data.guild.save();
            Embed.addField("Role:", `${role}`)
        }

        return interaction.reply({
            embeds: [Embed]
        });
    }
}