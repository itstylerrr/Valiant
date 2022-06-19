const { CommandInteraction, MessageEmbed, Client, GuildMember } = require('discord.js');
const ms = require("ms");

module.exports = {
    name: "mod",
    description: "Moderation Commands",
    options: [
        {
            name: "actions",
            description: "Permanent actions",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Pick a option from the list",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "⚠️ Warning", value: "warning" },
                        { name: "🥾 Kick", value: "kick" },
                        { name: "🔨 Ban", value: "ban" },
                    ]
                },
                {
                    name: "member",
                    description: "Select the member",
                    type: "USER",
                    required: true,
                },
                {
                    name: "reason",
                    description: "Provide a reason",
                    type: "STRING",
                    required: true,
                },
            ]
        },
        {
            name: "temp",
            description: "Temporary actions",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Pick a option from the list",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "🤐 Timeout", value: "timeout" },
                    ]
                },
                {
                    name: "duration",
                    description: "Set the duration of the timeout for the member",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "⏱️ 60 sec", value: "60 sec" },
                        { name: "⏱️ 5 mins", value: "5 mins" },
                        { name: "⏱️ 10 mins", value: "10 mins"},
                        { name: "⏱️ 1 hour", value: "1 hour" },
                        { name: "⏱️ 1 day", value: "1 day" },
                        { name: "⏱️ 1 week", value: "1 week" },
                    ]
                },
                {
                    name: "member",
                    description: "Select the member",
                    type: "USER",
                    required: true,
                },
                {
                    name: "reason",
                    description: "Provide a reason",
                    type: "STRING",
                    required: true,
                },
            ]
        },
        {
            name: "remove",
            description: "Remove active actions",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "removal",
                    description: "Pick a removal from the list",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "🗣️ Remove timeout", value: "remove timeout" },
                    ]
                },
                {
                    name: "member",
                    description: "Select the member",
                    type: "USER",
                    required: true,
                },
            ]
        },       
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client, data) {
        const { options, member, guild, channel } = interaction;
        if(!data.logging.modLogs) return interaction.reply({ content: "🚫 You have not set up mod logs, please do this by running /logging." });
    }
}