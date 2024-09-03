const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Check if all required fields are present
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please fill all the required fields' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({ name, email, phone, password });
        await user.save();

        // Generate JWT token
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error in register function:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error in login function:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
