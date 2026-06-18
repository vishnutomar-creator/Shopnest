const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/PaymentController")

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;