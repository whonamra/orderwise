const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true,
    },
    userId: {
        type: String,
        require: true,
        unique: true,
    },
    userName: {
        type: String,
        // require: true,
    },
    userEmail: {
        type: String,
        unique: true,
        require: true,
        // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    userImage: {
        type: String,
    },
});
module.exports = mongoose.model("User", userSchema);
