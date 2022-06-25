const { Message, MessageEmbed, Client } = require("discord.js");
const xp = require("simply-xp");
const date = new Date();
const DB = require("../../Structures/Database/Schemas/Guild");

module.exports = {
    name: "messageCreate",
    /**
     *
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        if (!message) return;
        if (!message.guild) return;
        if (!message.author) return;
        if (message.author.bot) return;

        DB.findOne({id: message.guildId}, async (err, data) => {
            if (err) throw err;

            if (data.addons.xp.enabled === false) return;

            if (date.getDay() == 6 || date.getDay() == 0) {
            xp.addXP(message, message.author.id, message.guild.id, {
                min: 20,
                max : 35,
            });
            return;
        } else {
            xp.addXP(message, message.author.id, message.guild.id, {
                min: 10,
                max : 25,
            });
            return;
        }
        })


    },
  };