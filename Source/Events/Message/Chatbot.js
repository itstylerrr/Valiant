const { Message, MessageEmbed, Client } = require("discord.js");
const DB = require("../../Structures/Database/Schemas/Guild");
const simplydjs = require("simply-djs");
const { botinfo } = require("../../../Configs/main.json");

module.exports = {
    name: "messageCreate",
    /**
     *
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        if (!message.guild) return;
        if (message.author.bot) return;

        DB.findOne({ id: message.guild.id }, async (err, data) => {
            if (!data) return;
            if (!data.addons.settings.cbChId);
            if(err) throw err;
            const id = data.addons.settings.chChId;

            if (message.channel.id !== id) return;

            const channel = message.guild.channels.cache.get(id);
            if (!channel) return;

            simplydjs.chatbot(client, message, {
                channelId: channel.id,
                name: message.guild.me.displayName,
                developer: `<@${botinfo.devId}>`
            });
          });
    },
  };