const { Schema, model } = require("mongoose");

const HelloCount = Schema({
    author_id: String,
    guild_id: String,
    Count: {
        default: 0,
        type: Number
    }
});

module.exports = model('count', HelloCount)