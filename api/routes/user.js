const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
router.post("/user-details", async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(505).json({ message: "No data" });
        }

        const { userId, userName, userEmail, userImage } = req.body;

        if (!userId || !userName || !userEmail || !userImage) {
            return res.status(505).json({ message: "Invalid data" });
        }

        // const doesExist = await User.findOne({ userId: req.body.userId });
        // if (!doesExist)
        //     return res.status(409).json({
        //         message: "User not found",
        //     });

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            userId: req.body.userId,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userImage: req.body.userImage,
            // groupId: req.body.groupId,
        });

        const savedUser = await user.save();
        res.send({
            body: savedUser,
            message: "Successfully Registered",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Something wrong occured. Please try again",
        });
    }

    // User.find({ email: req.body.email })
    //     .exec()
    //     .then((user) => {
    //         if (user.length > 0) {
    //             return res.status(409).json({
    //                 message: "User already exists",
    //             });
    //         } else {
    //             bcrypt.hash(req.body.password, 10, (err, hash) => {
    //                 if (err) {
    //                     return res.status(500).json({
    //                         error: err,
    //                     });
    //                 } else {
    //                     const user = new User({
    //                         _id: new mongoose.Types.ObjectId(),
    //                         email: req.body.email,
    //                         password: hash,
    //                         restName: req.body.restName,
    //                         address: req.body.address,
    //                         city: req.body.city,
    //                         state: req.body.state,
    //                         zip: req.body.zip,
    //                         restNumber: req.body.restNumber,
    //                     });
    //                     user.save()
    //                         .then((result) => {
    //                             console.log(result);
    //                             res.status(200).json({
    //                                 message: "New user Created with",
    //                                 _id: user._id,
    //                                 email: user.email,
    //                                 password: user.password,
    //                                 restName: user.restName,
    //                                 address: user.address,
    //                                 city: user.city,
    //                                 state: user.state,
    //                                 zip: user.zip,
    //                                 restNumber: user.restNumber,
    //                             });
    //                         })
    //                         .catch((err) => {
    //                             res.status(500).json({
    //                                 error: err,
    //                             });
    //                         });
    //                 }
    //             });
    //         }
    //     });
});

router.get("/user-details", async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(409).json({
            message: "invalid auth",
        });
    }
    const userId = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({ userId: userId });
    if (!user) {
        return res.status(409).json({
            message: "User not found",
        });
    } else {
        res.send({
            body: user,
            message: "User fetched successfully",
        });
    }
});

router.get("/search-user", async (req, res, next) => {
    const { search } = req.query;
    const dummy = String(search);
    User.find({
        $or: [
            { userName: { $regex: dummy, $options: "i" } },
            { userEmail: { $regex: dummy, $options: "i" } },
        ],
    }).then((result) => {
        return res.status(200).json({
            result,
        });
    });

    // const userId = req.headers.authorization.split(" ")[1];
    // const user = await User.findOne({ userId: userId });
    // if (!user) {
    //     return res.status(409).json({
    //         message: "User not found",
    //     });
    // } else {
    //     res.send({
    //         body: user,
    //         message: "User fetched successfully",
    //     });
    // }
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            bcrypt.compare(
                req.body.password,
                user[0].password,
                (err, result) => {
                    if (err) {
                        res.status(401).json({
                            error: err,
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                userId: user[0]._id,
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "7d",
                            }
                        );
                        return res.status(200).json({
                            message: "successfully login",
                            token: token,
                        });
                    }
                    res.status(401).json({
                        message: "Auth failed",
                    });
                }
            );
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
});

module.exports = router;
