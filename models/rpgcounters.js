const { Schema, model } = require('mongoose');

const RpgData = Schema({
    author_id: String,
    guild_id: String,
    huntcount: {
        default: 0,
        type: Number
    },
    workcount: {
        default: 0,
        type: Number
    },
    advcount: {
        default: 0,
        type: Number
    },
    farmcount: {
        default: 0,
        type: Number
    }
});

module.exports = model('Rpgcount', RpgData)