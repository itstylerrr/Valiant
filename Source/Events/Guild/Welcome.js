const { Client, MessageEmbed, GuildMember } = require('discord.js');
const DB = require('../../Structures/Database/Schemas/Guild');

module.exports = {
    name: "guildMemberAdd",
    once: true,
    /**
     * @param {GuildMember} member
     * @param {Client} client 
     */
    async execute(client, member) {
        let guild = member.guild;
        let guildData = await client.Database.fetchGuild(guild.id);
        const guildDb = await DB.findOne({ id: guild.id });
        if (!guildData.addons.welcome.enabled) return;
        let dbRole = guildDb.addons.welcome.role;
        let checkedRole = guild.roles.cache.find(r => r.id === dbRole);
        if (typeof checkedRole !== undefined) {
            member.roles.add(checkedRole.id);
        }

        let welcomeChannel = await client.tools.resolveChannel(guildData.addons.welcome.channel, guild);
        if (!welcomeChannel) return;

        let welcomeMsg = (guildData.addons.welcome.message === null || guildData.addons.welcome.message === "" || guildData.addons.welcome.message === " ") ? "Welcome {user.ping} to {guild.name}!" : guildData.addons.welcome.message;

        let finalMsg = await welcomeMsg
        .replace(/{user.ping}/g, `${member.user}`)
        .replace(/{user.name}/g, `${member.user.username}`)
        .replace(/{user.id}/g, `${member.user.id}`)
        .replace(/{user.tag}/g, `${member.user.tag}`)
        .replace(/{guild.name}/g, `${guild.name}`)
        .replace(/{guild.id}/g, `${guild.id}`)
        .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

        const Embed = new MessageEmbed()
        .setDescription(`${finalMsg}`)
        .setColor(client.user.accentColor)

        if (guildData.addons.welcome.embed === true) {
            return welcomeChannel.send({
                embeds: [Embed]
            });
        } else {
            return welcomeChannel.send({content: finalMsg });
        }
    }
}