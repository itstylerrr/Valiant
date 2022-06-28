const { model, Schema } = require("mongoose");

module.exports = model(
    "Tickets",
    new Schema({
        GuildID: String,
        MembersID: [String],
        OwnerID: String,
        TicketID: String,
        ChannelID: String,
        Closed: Boolean,
        Locked: Boolean,
        Type: String,
        Claimed: Boolean,
        Claimedby: String,
    })
);