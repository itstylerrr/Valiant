const { Schema, model } = require('mongoose');

module.exports = model("ModerationDB", new Schema({
    GuildID: String,
    UserID: String,
    ChannelIDs: Array,
    WarnData: Array,
    MuteData: Array,
    KickData: Array,
    BanData: Array,

    // AI Moderation System
    Punishments: Array,
    LogChannelIDs: Array,
}))