const mongoose = require("mongoose");

module.exports = mongoose.model("Reports", new mongoose.Schema({
    authorId: { type: String },
    errorCode: { type: String },
    text: { type: String },
    identification: { type: String}
}));