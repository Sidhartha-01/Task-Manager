const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Task_Manager");

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "task"
        }
    ]
});

module.exports = mongoose.model('user',userSchema);