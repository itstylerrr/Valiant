const { model, Schema} = require("mongoose");

module.exports = model("TicketSetup", new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Transcripts: String,
    Handlers: Array,
    Everyone: String,
    Description: String,
    TicketDescription: String,
    TicketID: Number,
    Content: String,
    Buttons: [String],
    initial: { type: Object, default: null },
    individual: { type: Object, default: null }
}));