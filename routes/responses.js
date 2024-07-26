const express = require('express');
const router = express.Router();
const { Complaint, Response, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// Middleware untuk memastikan hanya pengguna dengan peran 'staff' yang dapat mengakses endpoint ini

// Route untuk menanggapi pengaduan
router.post('/:id', [authenticate, authorize(['staff'])], async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.response) {
            return res.status(400).json({ message: 'Complaint already responded' });
        }

        const response = await Response.create({
            complaintId: complaint.id,
            responseText: req.body.responseText,
            staffId: req.user.id
        });

        complaint.status = 'resolved';
        complaint.staffId = req.user.id; //staffId diperbarui di Complaint
        await complaint.save();

        res.status(201).json(response);
    } catch (err) {
        console.error(err); // Log error ke console
        res.status(500).json({ message: 'Server error', error: err.message }); 
    }
});

// Route untuk melihat semua pengaduan (untuk staff)
router.get('/', [authenticate, authorize(['staff'])], async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            include: [
                {
                    model: Response,
                    as: 'response'
                }
            ]
        });
        res.json(complaints);
    } catch (err) {
        console.error(err); // Log error ke console
        res.status(500).json({ message: 'Server error', error: err.message }); 
    }
});

module.exports = router;
