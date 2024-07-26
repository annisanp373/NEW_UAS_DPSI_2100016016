const express = require('express');
const router = express.Router();
const { Complaint, Response, User } = require('../models');
const { authenticate } = require('../middleware/auth');

// Middleware untuk memastikan hanya pengguna dengan peran 'student' yang dapat mengakses endpoint ini
router.post('/', authenticate, async (req, res) => {
    try {
        // Menggunakan ID pengguna dari token JWT untuk mengaitkan pengaduan dengan pengguna yang membuatnya
        const complaint = await Complaint.create({
            studentId: req.user.id, 
            ...req.body 
        });
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route untuk melihat pengaduan oleh student
// Endpoint ini hanya bisa diakses oleh pengguna yang telah terotentikasi, memastikan bahwa seorang pengguna hanya dapat melihat pengaduan yang mereka buat sendiri
router.get('/my-complaints', authenticate, async (req, res) => {
    try {
        // Menyaring pengaduan berdasarkan ID pengguna yang diambil dari token JWT
        const complaints = await Complaint.findAll({
            where: { studentId: req.user.id },
            include: [
                {
                    model: Response,
                    as: 'response'
                }
            ]
        });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching complaints', error: err.message });
    }
});

module.exports = router;
