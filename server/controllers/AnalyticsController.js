const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find({});
        const totalRevenueData = orders.reduce((acc, order) => 
        acc + order.totalAmount, 0);

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenueData,
        });

    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = {
    getAdminStats,
};