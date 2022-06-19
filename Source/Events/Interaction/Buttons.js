const { ButtonInteraction, Client, MessageEmbed } = require("discord.js");
const config = require("../../../Configs/main.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (!client.buttons.has(interaction.customId)) return;
        const Button = client.buttons.get(interaction.customId);
        if(Button.permission && !interaction.member.permissions.has(Button.permission)) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`🚫 You are missing the permission: ${Button.permission}`)
                    .setColor("RED")
                ],
                ephemeral: true
            });
        }

        if (Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`🚫 Only the guild owner ${(await interaction.guild.fetchOwner()).displayName} can use this button.`)
                    .setColor("RED")
                ],
                ephemeral: true
            });
        }
        let userData = await client.Database.fetchUser(interaction.member.id);
        let guildData = await client.Database.fetchGuild(interaction.guild.id);
        let data = {};
        data.user = userData;
        data.guild = guildData;
        data.config = config;
        Button.execute(interaction, client, data);
    }
}