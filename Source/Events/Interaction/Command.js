const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require("../../../Configs/main.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isButton()) return;
        if (interaction.isCommand || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔ An error occured while running this command, please contact <@557016470048210964>.")
            ], ephemeral: true}) && client.commands.delete(interaction.commandName);

            if (command.permission && !interaction.member.permissions.has(command.permission)) {
                return interaction.reply({ content: `You do not have the required permission for this command: \`${interaction.commandName}\`.`, ephemeral: true })
            }
            let userData = await client.Database.fetchUser(interaction.member.id);
            let guildData = await client.Database.fetchGuild(interaction.guild.id);
            let guildLogging = await client.Database.fetchGuildsLogging(interaction.guild.id);
            let data = {};
            data.user = userData;
            data.guild = guildData;
            data.cmd = command;
            data.config = config;
            data.logging = guildLogging;
            command.execute(interaction, client, data);
        }
    }
}