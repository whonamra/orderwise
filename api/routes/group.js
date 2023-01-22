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
                if (el == userId) {
                    item.userIdArray = item.userIdArray.length;
                    result.push(item);
                }
            });
        });
        res.send({
            data: result,
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
        console.log(userId);
        const user = await User.findOne({ userId: userId });
        console.log(user);
        if (!user) {
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

router.post("/get-orders-by-groupid", async (req, res, next) => {
    try {
        const { groupId } = req.body;
        const group = await Group.findOne({ groupId: groupId });
        var result = [];
        console.log(group.userIdArray);
        for (const test of group.userIdArray) {
            // console.log(item);{
            var temp = await Order.find({ userId: test });
            for (const item of temp) {
                console.log(item);
                result.push(item);
            }
        }

        console.log(result);

        // await (
        //     await Group.find({})
        // ).forEach((item) => {
        //     item.userIdArray.forEach((el) => {
        //         if (el == userId) {
        //             item.userIdArray = item.userIdArray.length;
        //             result.push(item);
        //         }
        //     });
        // });
        res.send({
            data: result,
            message: "Groups Successfully fetched",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Unexpected error. Please try again",
        });
    }
});

module.exports = router;
