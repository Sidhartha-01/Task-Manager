const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/Posting_App");

const taskSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    date: {
        type: Date,
        default: Date.now
    },
    title: String,
    content: String
    
});

module.exports = mongoose.model('task',taskSchema);