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

        try { 
            guild.members.cache.get(guild.ownerId)?.send({ embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Hey 👋, thanks for inviting me to your server!")
                .setDescription("If you need help setting me up check out the docs at | https://comingsoon.com |.")
            ]})
        } catch(err) {};
    },
};