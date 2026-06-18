const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {  // generating token

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });

        }
        const salt = await bcrypt.genSalt(10);       // hashig the password
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });  // sending otp
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Mathfloor (wrong) Math.floor(correct)

            const message = `welcome to shopnest, ${name}!
            Your OTP for shopnest registration is: ${otp}`;

            await sendEmail(email, 'welcome to shopnest - your otp for regisrtration ', message);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)

            });
        }

        else {
            res.status(400).json({ message: 'Invalid user data'})
        }



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getUsers };



