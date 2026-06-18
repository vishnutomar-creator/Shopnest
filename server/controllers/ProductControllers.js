const Product = require('../model/product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product)
        }
        else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createProducts = async (req, res) => {

    try {
        const { name, price, description, category, stock } = req.body;
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            // console.log(result);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            imageUrl
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                // console.log(result);
                imageUrl = result.secure_url;
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

const deleteProduct = async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message: "product deleted succesfully"})
        }
        else {
            res.status(404).json({
                message: "product not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProducts,
    updateProduct,
    deleteProduct
};
