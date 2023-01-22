const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true,
    },
    userId: {
        type: String,
        require: true,
    },
    groupId: {
        type: String,
        require: true,
    },
    storeName: {
        type: String,
    },
    address: {
        type: String,
    },
    orderStatus: {
        type: String,
        enum: ["online", "offline"],
    },
    isComplete: {
        type: Boolean,
        default: false,
    },
    list: {
        type: String,
    },
    boughtBy: {
        type: String,
    },
    createdAt: {
        type: String,
    },
});
module.exports = mongoose.model("Order", orderSchema);
