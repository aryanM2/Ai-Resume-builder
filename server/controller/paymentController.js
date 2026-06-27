import crypto from 'crypto';
import User from '../models/user.js';
import { getRazorpay } from '../config/razorpay.js';

export const createOrder = async (req, res) => {
    try {
        const razorpay = getRazorpay();
        
        const options = {
            amount: 6900, // amount in the smallest currency unit (100 paise = 1 INR)
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Error creating order");
        }

        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Payment details are required" });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            console.error("RAZORPAY_KEY_SECRET is not defined");
            return res.status(500).json({ message: "Payment verification configuration error" });
        }

        const sha = crypto.createHmac('sha256', keySecret);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest('hex');

        if (digest !== razorpay_signature) {
            return res.status(400).json({ message: "Transaction is not legit!" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                isSubscribed: true,
                razorpay_payment_id: razorpay_payment_id,
            },
            { new: true }
        ).select('-password');

        res.json({ message: "Payment successful", user });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};