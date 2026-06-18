const express = require("express");
const router = express.Router();
const { admin } = require("../middleware/AdminMiddleware");
const { protect } = require("../middleware/AuthMiddleware");
const { getProducts, getProductById, createProducts, updateProduct, deleteProduct } = require("../controllers/ProductControllers")
const multer = require("multer"); // multer uploads the form data locally for temporary for uploading to cloudinary
const upload = multer({ dest: 'uploads/' });// tempory files are stored in this folder

// all products
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProducts)
// specific product
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);


module.exports = router;