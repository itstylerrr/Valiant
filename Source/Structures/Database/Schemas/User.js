const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
    id: { type: String },
    registeredAt: { type: Number, default: Date.now() },
    cash: { type: Number, default: 1000 },
    bank: { type: Number, default: 0 },
    job: { type: Number, default: 0 },
    workcd: { type: Number },
    items: { type: Object, default: {
        pistol: false,
        ammo: false,
        phone: false,
        stock: false,
        computer: false,
        fishingRod: false,
        ideLicense: false,
        server: false,
        boat: false,
        store: false

    } }
}));