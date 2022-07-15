const { Client, Guild, MessageEmbed } = require("discord.js")
module.exports = {
    name: "guildCreate",
    once: false,
    /**
     * @param {Client} client 
     * @param {Guild} guild
     */

    async execute(guild, client) {
        await guild.commands.set(client.publicCommands);
    },
};