const mongoose = require("mongoose");
const groupSchema = mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true,
    },
    groupName: {
        type: String,
        require: true,
    },  
    userIdArray: {
        type: [String],
    },
});
module.exports = mongoose.model("Group", groupSchema);
