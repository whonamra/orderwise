const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/orderSchema");
const Group = require("../models/groupSchema");
const User = require("../models/userSchema");

router.get("/get-groups", async (req, res, next) => {
    try {
        const userId = req.headers.authorization.split(" ")[1];
        const result = [];
        await (
            await Group.find({})
        ).forEach((item) => {
            item.userIdArray.forEach((el) => {
                if (el == userId) result.push(item.groupId);
            });
        });
        console.log(result);
        res.send({
            result,
            message: "Groups Successfully fetched",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Unexpected error. Please try again",
        });
    }
});

router.post("/add-groups", async (req, res, next) => {
    try {
        const userId = req.headers.authorization.split(" ")[1];
        const { groupName } = req.body;
        var userIdArray = [String(`${[userId]}`)];
        const grp = new Group({
            groupId: new mongoose.Types.ObjectId(),
            groupName,
            userIdArray,
        });
        const savedGrp = await grp.save();

        res.send({
            savedGrp,
            message: "Group created Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Unexpected error. Please try again",
        });
    }
});

router.post("/join-groups", async (req, res, next) => {
    try {
        const userId = req.headers.authorization.split(" ")[1];
        const user = await User.find({ userId: userId });
        if (!user.length) {
            return res.status(409).json({
                message: "User not found",
            });
        }
        const { groupId } = req.body;
        const group = await Group.find({ groupId: groupId });
        if (!group.length) {
            return res.status(409).json({
                message: "Group not found",
            });
        }

        const usrArr = group[0].userIdArray;
        usrArr.push(userId);
        console.log(usrArr);

        await Group.findOneAndUpdate(
            { groupId },
            {
                userIdArray: usrArr,
            },
            { upsert: true }
        );

        const updatedGroup = await Group.find({ groupId: groupId });

        res.send({
            updatedGroup,
            message: "Group joined Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error,
            message: "Unexpected error. Please try again",
        });
    }
});

module.exports = router;
