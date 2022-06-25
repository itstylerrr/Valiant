const xp = require("simply-xp");
const client = require("../../Structures/valiant");

client.on("levelUp", async (message, data) => {
    message.channel.send({
        content: `🥳 <@${data.userID}>, **Level Up! 🎉** Now you are **level ${data.level}** in **${message.guild.name}**.`
    });
    xp.lvlRole(message, data.userID, data.guildID);

    return;
})