const  { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    description: "Server info.",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { guild } = interaction;

        const { createdTimestamp, ownerId, description, members, memberCount, channels, emojis, stickers } = guild;

        const Embed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(guild.name, guild.iconURL({dynamic: true}))
        .setThumbnail(guild.iconURL({dynamic: true}))
        .addFields(
            {
                name: "🚦 | General",
                value: 
                `
                Name: ${guild.name}
                Created: <t:${parseInt(createdTimestamp / 1000)}:R>
                Owner: <@${ownerId}>

                Description: ${description || "This server has not yet set a server description."}
                `
            },
            {
                name: "🕴️| Users",
                value: 
                `
                - Members: ${members.cache.filter((m) => ! m.user.bot).size}
                - Bots: ${members.cache.filter((m) => m.user.bot). size}
                
                Total: ${memberCount}
                `
            },
            {
                name: "📖 | Channels",
                value:
                `
                - Text ${channels.cache.filter((c) => c.type === "GUILD_TEXT").size}
                - Voice ${channels.cache.filter((c) => c.type === "GUILD_VOICE").size}
                - Threads ${channels.cache.filter((c) => c.type === "GUILD_NEWS_THREAD" && "GUILD_PRIVATE_THREAD" && "GUILD_PUBLIC_THREAD").size}
                - Categories ${channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}
                - Stages ${channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE").size}
                - News ${channels.cache.filter((c) => c.type === "GUILD_NEWS").size}

                Total: ${channels.cache.size}
                `
            },
            {
                name: "😀 | Emojis & Stickers",
                value:
                `
                - Animated ${emojis.cache.filter((e) => e.animated).size}
                - Static: ${emojis.cache.filter((e) => !e.animated).size}
                - Stickers: ${stickers.cache.size}

                Total: ${stickers.cache.size + emojis.cache.size}
                `
            },
            {
                name: "<a:nitro:970844357567586364> | Nitro Statistics",
                value:
                `
                - Tier: ${guild.premiumTier.replace("TIER_", "Tier ")}
                - Boost Count: ${guild.premiumSubscriptionCount}
                - Boosters: ${members.cache.filter((m) => m.premiumSince).size}
                `
            },
            {
                name: "🥐 | Roles",
                value:
                `
                - Total Roles: ${guild.roles.cache.size}
                `
            }
        )
        .setFooter("Last Checked")
        .setTimestamp()

        interaction.reply({embeds: [Embed]});
    }
}