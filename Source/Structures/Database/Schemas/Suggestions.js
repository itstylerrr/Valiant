const mongoose = require("mongoose");

module.exports = mongoose.model("Suggestions", new mongoose.Schema({
    authorId: { type: String },
    suggestion: { type: String },
    text: { type: String },
    identification: { type: String}
}));