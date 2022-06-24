const xp = require("simply-xp");
const client = require("../../Structures/valiant");

client.on("levelUp", async (message, data) => {
    message.reply({
        content: `🥳 ${message.author}, **Level Up! 🎉** Now you are **level ${data.level}** in **${message.guild.name}**.`
    });
    xp.lvlRole(message, message.author.id, message.guild.id);

    return;
})