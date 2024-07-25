const express = require('express');
const router = express.Router();
const { User } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'your_jwt_secret';

// Registrasi Student
router.post('/register/student', async (req, res) => {
    const { name, email, password, nim } = req.body;

    if (!name || !email || !password || !nim) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        
        await User.create({
            name,
            email,
            password,
            role: 'student',
            nim
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Registrasi Staff
router.post('/register/staff', async (req, res) => {
    const { name, email, password, id_staff } = req.body;

    if (!name || !email || !password || !id_staff) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        
        await User.create({
            name,
            email,
            password,
            role: 'staff',
            id_staff
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Route login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'email yang anda masukkan salah' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password yang anda masukkan salah' });
        }
        const token = jwt.sign({ id: user.id, role: user.role },
            'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
});


module.exports = router;