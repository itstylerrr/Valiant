const { Message, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Logging");

module.exports = {
    name: "messageCreate",
    /**
     *
     * @param {Message} message
     */
    async execute(message) {
        if (!message.guild) return;
        DB.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (!data) return;
        if (!data.guildLogs) return;
        if(err) throw err;
        const array = require(`../../../Extra/Files/JSON/ScamLinks.json`);
        if (array.some((word) => message.content.toLowerCase().includes(word))) {
          message.delete();
          const Ex = new MessageEmbed()
            .setTitle("Scam Detected")
            .setColor("RED")
            .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
            .addField(
              "User:",
              `\`\`\`${message.author.tag} (${message.author.id})\`\`\``
            )
            .addField("Message Content:", `\`\`\`${message.content}\`\`\``)
            .setTimestamp();
          await message.author.send({ embeds: [Ex.setDescription(`I have detected a potention scam message. You cannot send scam messages in this server. If you believe this is an error, please contact the server moderators.`)] }).catch((err) => {
            Ex.addField(`DM Sent?`, `No, unable to send a DM.\n\n**Error:**\n\`${err}\``)
          });
          await message.guild.channels.cache.get(data.guildLogs).send({embeds: [Ex.setDescription(`I have detected a potention scam message. You can choose what you would like to do next with the member. To time them out, you can use /mod actions timeout <duration>.`).addField("DM Sent?", "Yes, DM has been sent to user regarding the issue.")]});
          return;
        }
      });
    },
  };