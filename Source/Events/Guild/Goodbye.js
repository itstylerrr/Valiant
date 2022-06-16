const { Client, MessageEmbed, GuildMember } = require('discord.js');
const DB = require('../../Structures/Database/Schemas/Guild');

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     * @param {Client} client 
     */
    async execute(member, client) {
        let guild = member.guild;
        let guildData = await client.Database.fetchGuild(guild.id); // Get guild document from database
        if(!guildData.addons.goodbye.enabled) return; // Goodbye messages aren't enabled
    
        let goodbyeChannel = await client.tools.resolveChannel(guildData.addons.goodbye.channel, guild); // Try find the channel
        if(!goodbyeChannel) return; // Unable to find channel in guild
    
        let goodbyeMsg = (guildData.addons.goodbye.message === null || guildData.addons.goodbye.message === "" || guildData.addons.goodbye.message === " ") ? "{user.ping} has left the server!" : guildData.addons.goodbye.message; // Get the custom message or use the preset one

        let finalMsg = await goodbyeMsg
        .replace(/{user.ping}/g, `${member.user}`)
        .replace(/{user.name}/g, `${member.user.username}`)
        .replace(/{user.id}/g, `${member.user.id}`)
        .replace(/{user.tag}/g, `${member.user.tag}`)
        .replace(/{guild.name}/g, `${guild.name}`)
        .replace(/{guild.id}/g, `${guild.id}`)
        .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

        const Embed = new MessageEmbed()
        .setDescription(`${finalMsg}`)
        .setColor(guild.me.displayHexColor)

        if (guildData.addons.goodbye.embed === true) {
            return goodbyeChannel.send({
                embeds: [Embed]
            });
        } else {
            return goodbyeChannel.send({content: finalMsg });
        }
    }
}