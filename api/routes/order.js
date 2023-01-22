const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/orderSchema");
const User = require("../models/userSchema");

router.post("/add-order", async (req, res, next) => {
    try {
        const userId = req.headers.authorization.split(" ")[1];
        const user = await User.find({ userId: userId });
        console.log(user);
        if (!user) {
            return res.status(409).json({
                message: "User not found",
            });
        }

        

        const order = new Order({
            orderId: new mongoose.Types.ObjectId(),
            userId: userId,
            groupId: req.body.groupId,
            storeName: req.body.storeName,
            address: req.body.address,
            orderStatus: req.body.orderStatus,
            isComplete: req.body.isComplete,
            list: req.body.list,
            boughtBy: req.body.boughtBy,
            createdAt: req.body.createdAt,
        });

        const savedorder = await order.save();
        res.send({
            body: savedorder,
            message: "Order Successfully added",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Unexpected error. Please try again",
        });
    }
});

router.get("/get-orders", async (req, res, next) => {
    try {
        const userId = req.headers.authorization.split(" ")[1];
        const orderDetails = await Order.find({ userId: userId });
        if (!orderDetails) {
            return res.status(409).json({
                message: "Order not found",
            });
        }

        res.send({
            orderDetails,
            message: "Orders Successfully fetched",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Unexpected error. Please try again",
        });
    }
});

router.get("/get-order-by-storename/:storename", async (req, res, next) => {
    try {
        const storename = req.params.storename;
        const userId = req.headers.authorization.split(" ")[1];
        const orderDetails = await Order.findAll({
            userId: userId,
            storeName: storename,
        });
        if (!orderDetails) {
            return res.status(409).json({
                message: "Order not found",
            });
        }

        res.send({
            orderDetails,
            message: "Orders Successfully fetched",
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "Unexpected error. Please try again",
        });
    }
});

// router.get("/:productId", (req, res, next) => {
//     const id = req.params.productId;
//     Slot.findById(id)
//         // .select("className students") just pass string for the things u wants to select in get
//         .exec()
//         .then((docs) => {
//             console.log(docs);
//             if (docs) {
//                 res.status(200).json({
//                     item: docs,
//                     request: {
//                         type: "GET",
//                         description: "FOR_ALL_ITEMS",
//                         url: "http://localhost:3000/products",
//                     },
//                 });
//             } else {
//                 res.status(404).json({
//                     message: "PAGE NOT FOUND 404",
//                 });
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({ error: err });
//         });
// });
// router.post("/", checkAuth, (req, res, next) => {
//     const slots = new Slot({
//         _id: new mongoose.Types.ObjectId(),
//         className: req.body.className,
//         faculty: req.body.faculty,
//         students: req.body.students,
//         action: req.body.action,
//     });
//     slots
//         .save()
//         .then((result) => {
//             console.log(result);
//             res.status(201).json({
//                 message: "New item registered in database",
//                 createdSlots: {
//                     length: result.length,
//                     data: {
//                         _id: result._id,
//                         className: result.className,
//                         faculty: result.faculty,
//                         students: result.students,
//                         action: result.action,
//                         request: {
//                             type: "GET",
//                             url: "http://localhost:3000/products/" + result._id,
//                         },
//                     },
//                 },
//             });
//         })

//         .catch((err) => {
//             console.log(err),
//                 res.status(500).json({
//                     message: "error in post req",
//                     error: err,
//                 });
//         });
// });

// router.post("/:productId", checkAuth, (req, res, next) => {
//     res.status(200).json({
//         message: "handling the post requests for products for specific id",
//         productId: req.params.productId,
//     });
// });
// router.patch("/:productId", checkAuth, (req, res, next) => {
//     const id = req.params.productId;
//     const updateOps = {};
//     for (const ops of req.body) {
//         updateOps[ops.propName] = ops.value;
//     }
//     Slot.update({ _id: id }, { $set: updateOps })
//         .exec()
//         .then((result) => {
//             console.log(result);
//             res.status(200).json({
//                 message: "Update is successfully done",
//                 request: {
//                     type: "GET",
//                     url: "http://localhost:3000/products/" + id,
//                 },
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 error: err,
//             });
//         });
// });
// router.delete("/:productId", checkAuth, (req, res, next) => {
//     const id = req.params.productId;
//     Slot.remove({ _id: id })
//         .exec()
//         .then((result) => {
//             res.status(200).json({
//                 message: "Item deleted successfully",
//                 request: {
//                     type: "POST",
//                     url: "http://localhost:3000/products/" + result._id,
//                     data: {
//                         className: "STRING",
//                         faculty: "STRING",
//                         student: "INTEGER",
//                         action: "STRING",
//                     },
//                 },
//             });
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 error: err,
//             });
//         });
// });

module.exports = router;
