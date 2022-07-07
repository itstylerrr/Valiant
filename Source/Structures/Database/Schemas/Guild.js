const mongoose = require("mongoose"),
config = require("../../../../Configs/main.json");

module.exports = mongoose.model("Guild", new mongoose.Schema({

    id: { type: String }, //ID of the guild
    registeredAt: { type: Number, default: Date.now() },
    prefix: { type: String, default: "'" },
    test: { type: String, default: "blank" },

    addons: { type: Object, default: { // Extra features data
        welcome: {
            enabled: false, // Welcome features are enabled
            channel:  null, // ID for the channel to send messages to
            message: null, // Custom message
            image: false, // Check if image is enabled
            embed: false, // Check if embed is enabled
            json: null,
            role: null, // Role to give the user once they join the guild.
        },
        goodbye: {
            enabled: false, // Goodbye features are enabled
            channel:  null, // ID for channel to send messages to
            message: null, // Custom message
            image: false, // Check if image is enabled
            json: null,
            embed: false // Check if embed is enabled
        },
        settings: {
            cbChId: null,
            loggingId: null,
        },
        xp: {
            enabled: false,
            background: null,
            channel: null
        }
    }}

}));