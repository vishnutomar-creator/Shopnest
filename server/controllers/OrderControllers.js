const Order = require("../model/order");

const sendEmails = require('../utils/sendEmail');

// create new order
const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, address, paymentId } = req.body;
        // console.log(req.body)
        if (!products || products.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: "invalid order data" });
        }
        else {
            const order = new Order({
                user: req.user._id,
                products,
                totalAmount,
                address,
                paymentId
            });
            // console.log("Order to save:", order);
            await order.save();
            const message = `Dear ${req.user.name}, \n\nThank you for your order! Your order has been succesfully created with the following details:\n\n Order ID: ${order._id}\n\n Total Amount: ${totalAmount}\n Shipping Address: ${address.fullName}, ${address.street}, ${address.city}, ${address.postalCode},  ${address.country} \n\n We will notify you once your order is shipped.\n\nBest regards,\nShopNest Team`;


            await sendEmails(req.user.email, 'Order Created', message);
            res.status(201).json({
                message: 'Order created succesfully', order
            })
        }
    } catch (error) {
        // console.error("CREATE ORDER ERROR:", error);

        res.status(500).json({
            message: "Error creating order", error: error.message
        });
    }


};


const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.productId', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders', error
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders ', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated', order });
        }

        else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error', error: error.message })
    }
}

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus,
};