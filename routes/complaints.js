// Middleware untuk memastikan hanya pengguna dengan peran 'student' yang dapat mengakses endpoint ini

const express = require('express');
const router = express.Router();
const { Complaint, Response, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// Mengirim Pengaduan (hanya untuk student)
router.post('/', authenticate, authorize('student'), async (req, res) => {
    try {
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
router.get('/my-complaints', authenticate, authorize('student'), async (req, res) => {
    try {
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
