const mongoose = require("mongoose");

module.exports = mongoose.model("Logging", new mongoose.Schema({
    GuildID: { type: String },
    memberLogs: { type: String, default: null },
    modLogs: { type: String, default: null },
    guildLogs: { type: String, default: null },
}));