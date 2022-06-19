const Discord = require("discord.js");
const config = require("../../../Configs/main.json");
userSchema = require("./Schemas/User");
guildSchema = require("./Schemas/Guild");
memberSchema = require("./Schemas/Member");
logSchema = require("./Schemas/Log");
loggingSchema = require("./Schemas/Logging");

// ◜    Create/find the users DB  ◞
module.exports.fetchUser = async function(key) {
    let userDB = await userSchema.findOne({ id: key });
    if (userDB) {
        return userDB;
    } else {
        userDB = new userSchema({
            id: key,
            registeredAt: Date.now()
        });
        await userDB.save().catch(err => console.log(err));
        return userDB;
    }
};

// ◜    Create/find the guilds logging DB  ◞
module.exports.fetchGuildsLogging = async function(key) {
    let guildLogs = await loggingSchema.findOne({ GuildID: key });
    if (guildLogs) {
        return guildLogs;
    } else {
        guildLogs = new loggingSchema({
            GuildID: key,
        });
        await guildLogs.save().catch(err => console.log(err));
        return guildLogs;
    }
};

// ◜    Create/find the guilds DB  ◞
module.exports.fetchGuild = async function(key){

    let guildDB = await guildSchema.findOne({ id: key });

    if(guildDB){
        return guildDB;
    }else{
        guildDB = new guildSchema({
            id: key,
            registeredAt: Date.now()
        })
        await guildDB.save().catch(err => console.log(err));
        return guildDB;
    }
};

// ◜    Create/Find the members DB  ◞
module.exports.fetchMember = async function(userID, guildID){

    let memberDB = await memberSchema.findOne({ id: userID, guildID: guildID });
    if(memberDB){
        return memberDB;
    }else{
        memberDB = new memberSchema({
            id: userID,
            guildID: guildID,
            registeredAt: Date.now()
        })
        await memberDB.save().catch(err => console.log(err));
        return memberDB;
    };
};

// ◜    Create/Find log in the DB  ◞
module.exports.createLog = async function(message, data){

    let logDB = new logSchema({
        commandName: data.cmd.name,
        author: { username: message.author.username, discriminator: message.author.discriminator, id: message.author.id },
        guild: { name: message.guild ? message.guild.name : "dm", id: message.guild ? message.guild.id : "dm", channel: message.channel ? message.channel.id : "unknown" },
        date: Date.now()
    });
    await logDB.save().catch(err => console.log(err));
    return;

};