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
            let guildData = await client.Database.fetchGuild(guild.id);
            const guildDb = await DB.findOne({ id: guild.id });
            if (!guildData.addons.goodbye.enabled) return;
            let goodbyeChannel = await client.tools.resolveChannel(guildData.addons.goodbye.channel, guild);
            if (!goodbyeChannel) return;
    
            if (guildData.addons.goodbye.json) {
                if (guildData.addons.goodbye.json.content) {
                    let goodbyeMsg = guildData.addons.goodbye.json.content;
    
                    let finalMsg = goodbyeMsg
                    .replace(/{user.ping}/g, `${member.user}`)
                    .replace(/{user.name}/g, `${member.user.username}`)
                    .replace(/{user.id}/g, `${member.user.id}`)
                    .replace(/{user.tag}/g, `${member.user.tag}`)
                    .replace(/{guild.name}/g, `${guild.name}`)
                    .replace(/{guild.id}/g, `${guild.id}`)
                    .replace(/{guild.totalUser}/g, `${guild.memberCount}`);
    
                    goodbyeChannel.send({
                        content: `${finalMsg}`
                    });
                }
    
                if (guildData.addons.goodbye.json.embed) {
                    const embedData = guildData.addons.goodbye.json.embed;
                    const dbEmbed = guildData.addons.goodbye.json.embed;
                    const Embed = new MessageEmbed();
                    if (dbEmbed.description) {
                        let fromDb = guildData.addons.goodbye.json.embed.description;
    
                        let finalString = fromDb
                        .replace(/{user.ping}/g, `${member.user}`)
                        .replace(/{user.name}/g, `${member.user.username}`)
                        .replace(/{user.id}/g, `${member.user.id}`)
                        .replace(/{user.tag}/g, `${member.user.tag}`)
                        .replace(/{guild.name}/g, `${guild.name}`)
                        .replace(/{guild.id}/g, `${guild.id}`)
                        .replace(/{guild.totalUser}/g, `${guild.memberCount}`);
    
                        Embed.setDescription(finalString);
                    }
                    if (dbEmbed.author.name) {
                        let fromDb = guildData.addons.goodbye.json.embed.author.name;
    
                        let finalString = fromDb
                        .replace(/{user.ping}/g, `${member.user}`)
                        .replace(/{user.name}/g, `${member.user.username}`)
                        .replace(/{user.id}/g, `${member.user.id}`)
                        .replace(/{user.tag}/g, `${member.user.tag}`)
                        .replace(/{guild.name}/g, `${guild.name}`)
                        .replace(/{guild.id}/g, `${guild.id}`)
                        .replace(/{guild.totalUser}/g, `${guild.memberCount}`);
    
                        Embed.setAuthor({ name: finalString, iconURL: embedData.author.icon_url || null, url: embedData.author.url || null });
                    }
                    if (dbEmbed.image) {
                        Embed.setImage(dbEmbed.image.url);
                    }
                    if (dbEmbed.thumbnail) {
                        Embed.setThumbnail(dbEmbed.thumbnail.url);
                    }
                    if (dbEmbed.fields) {
                        let dbFields = dbEmbed.fields;
                        dbFields.forEach(fields => {
                            let fieldsName = fields.name;
    
                            let finalName = fieldsName
                            .replace(/{user.ping}/g, `${member.user}`)
                            .replace(/{user.name}/g, `${member.user.username}`)
                            .replace(/{user.id}/g, `${member.user.id}`)
                            .replace(/{user.tag}/g, `${member.user.tag}`)
                            .replace(/{guild.name}/g, `${guild.name}`)
                            .replace(/{guild.id}/g, `${guild.id}`)
                            .replace(/{guild.totalUser}/g, `${guild.memberCount}`);
    
                            let fieldsValue = fields.value;
    
                            let finalValue = fieldsValue
                            .replace(/{user.ping}/g, `${member.user}`)
                            .replace(/{user.name}/g, `${member.user.username}`)
                            .replace(/{user.id}/g, `${member.user.id}`)
                            .replace(/{user.tag}/g, `${member.user.tag}`)
                            .replace(/{guild.name}/g, `${guild.name}`)
                            .replace(/{guild.id}/g, `${guild.id}`)
                            .replace(/{guild.totalUser}/g, `${guild.memberCount}`);
    
                            
    
                            Embed.addField(finalName, finalValue, fields.inline);
                        });
                    }
                    if (embedData.footer) {
                        let fromDb = embedData.footer.text;
    
                        let finalValue = fromDb
                        .replace(/{user.ping}/g, `${member.user}`)
                        .replace(/{user.name}/g, `${member.user.username}`)
                        .replace(/{user.id}/g, `${member.user.id}`)
                        .replace(/{user.tag}/g, `${member.user.tag}`)
                        .replace(/{guild.name}/g, `${guild.name}`)
                        .replace(/{guild.id}/g, `${guild.id}`)
                        .replace(/{guild.totalUser}/g, `${guild.memberCount}`);
    
                        Embed.setFooter({ text: finalValue, iconURL: embedData.footer.icon_url || null });
                    }
    
                    if (embedData.color) {
                        Embed.setColor(embedData.color);
                    }
                    
                    goodbyeChannel.send({
                        embeds: [Embed]
                    });
                }
            }
    }
}