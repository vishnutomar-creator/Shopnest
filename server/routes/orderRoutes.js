const express = require("express");
const { protect } = require("../middleware/AuthMiddleware");
const { admin } = require('../middleware/AdminMiddleware');
const { createOrder, getOrders, myOrders, updateOrderStatus } = require("../controllers/OrderControllers")

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, myOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
