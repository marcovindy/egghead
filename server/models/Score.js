const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ScoreSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

module.exports = Score = mongoose.model('score', ScoreSchema);