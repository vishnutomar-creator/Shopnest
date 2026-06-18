const Razorpay = require("razorpay");
const crypto = require("crypto"); // used to generate random values
dotenv = require("dotenv").config();

const createOrder = async(req,res) => { // express controller function
    try {
        const instance = new Razorpay({  // authenticating with Razorpay using your API keys
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: req.body.amount * 100, // amount in the smallest currency unit  (paisa)
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"), // Generates a unique receipt ID
        };
        const order = await instance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "server error"});
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

        if(generated_signature === razorpay_signature) {
            return res.status(200).json({message: 'Payment verified successfully'});
        }
        else {
            return res.status(400).json({message: 'Invalid payment signature'});
        }
    } catch (error) {
        return res.status(500).json({message: 'server error'});
    }
};

module.exports = {
    createOrder,
    verifyPayment,
}

