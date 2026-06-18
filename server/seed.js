const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

// Import models
const User = require("./model/user");
const Product = require("./model/product");
const Order = require("./model/order");

// Load env variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to Database
    await connectDB();

    console.log("Clearing existing database collections...");
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log("Database cleared.");

    // 1. Create Users
    console.log("Generating users...");
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    const usersToCreate = [
      {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: adminPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "John Doe",
        email: "john.doe@shopnest.com",
        password: userPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane.smith@shopnest.com",
        password: userPassword,
        role: "user",
        verified: true,
      },
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`Successfully seeded ${createdUsers.length} users.`);

    const adminUser = createdUsers.find(u => u.role === "admin");
    const johnUser = createdUsers.find(u => u.email === "john.doe@shopnest.com");
    const janeUser = createdUsers.find(u => u.email === "jane.smith@shopnest.com");

    // 2. Create Products
    console.log("Generating products...");
    const productsToCreate = [
      {
        name: "Wireless Noise-Canceling Headphones",
        description: "Premium over-ear headphones with hybrid active noise cancellation, high-fidelity sound quality, and up to 40 hours of battery life.",
        price: "199.99",
        category: "Electronics",
        stock: "45",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        rating: 4.8,
        numReviews: 24,
      },
      {
        name: "Smart Watch Pro",
        description: "Advanced fitness and health tracker featuring GPS, heart rate monitor, sleep tracking, and a stunning AMOLED always-on display.",
        price: "249.99",
        category: "Electronics",
        stock: "30",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        rating: 4.5,
        numReviews: 18,
      },
      {
        name: "Minimalist Leather Backpack",
        description: "Water-resistant commuter backpack handcrafted from genuine top-grain leather. Features a dedicated 15-inch laptop sleeve.",
        price: "129.99",
        category: "Accessories",
        stock: "15",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
        rating: 4.7,
        numReviews: 12,
      },
      {
        name: "Ergonomic Office Chair",
        description: "High-back mesh desk chair with adjustable lumbar support, 3D armrests, and dynamic recline mechanisms for all-day comfort.",
        price: "349.99",
        category: "Home & Office",
        stock: "20",
        imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60",
        rating: 4.6,
        numReviews: 35,
      },
      {
        name: "Professional Chef Knife",
        description: "8-inch multipurpose kitchen knife forged from high-carbon German steel. Features an ergonomic pakkawood handle.",
        price: "79.99",
        category: "Kitchen",
        stock: "50",
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
        rating: 4.9,
        numReviews: 40,
      },
      {
        name: "Smart LED Desk Lamp",
        description: "Eye-caring desk lamp with multiple color modes, step-less brightness adjustments, a built-in wireless charger, and USB port.",
        price: "49.99",
        category: "Home & Office",
        stock: "60",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60",
        rating: 4.4,
        numReviews: 15,
      },
    ];

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`Successfully seeded ${createdProducts.length} products.`);

    // 3. Create Orders
    console.log("Generating orders...");
    const ordersToCreate = [
      {
        user: johnUser._id,
        products: [
          {
            productId: createdProducts[0]._id, // Headphones
            quantity: 1,
            price: 199.99,
          },
          {
            productId: createdProducts[2]._id, // Backpack
            quantity: 1,
            price: 129.99,
          },
        ],
        totalAmount: 329.98,
        address: {
          fullName: "John Doe",
          street: "123 Main Street, Apt 4B",
          city: "New York",
          postalCode: "10001",
          country: "United States",
        },
        paymentId: "pay_Ksh129fsadfa",
        status: "delivered",
      },
      {
        user: janeUser._id,
        products: [
          {
            productId: createdProducts[1]._id, // Smart Watch
            quantity: 1,
            price: 249.99,
          },
          {
            productId: createdProducts[5]._id, // Smart Lamp
            quantity: 2,
            price: 49.99,
          },
        ],
        totalAmount: 349.97,
        address: {
          fullName: "Jane Smith",
          street: "456 Oak Avenue",
          city: "Los Angeles",
          postalCode: "90001",
          country: "United States",
        },
        paymentId: "pay_Ksh984fsdffg",
        status: "shipped",
      },
      {
        user: johnUser._id,
        products: [
          {
            productId: createdProducts[4]._id, // Chef Knife
            quantity: 1,
            price: 79.99,
          },
        ],
        totalAmount: 79.99,
        address: {
          fullName: "John Doe",
          street: "123 Main Street, Apt 4B",
          city: "New York",
          postalCode: "10001",
          country: "United States",
        },
        paymentId: "pay_Ksh765dafhrt",
        status: "pending",
      },
    ];

    const createdOrders = await Order.insertMany(ordersToCreate);
    console.log(`Successfully seeded ${createdOrders.length} orders.`);

    console.log("Database seeding completed successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
