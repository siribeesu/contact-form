// controllers/contactController.js
// Handles contact form submission and retrieval

const ContactMessage = require('../models/ContactMessage');
const { body } = require('express-validator');

// ─── Validation rules for contact form ───────────────────────────────────────
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Please enter a valid phone number'),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3 }).withMessage('Subject must be at least 3 characters')
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 20 }).withMessage('Message must be at least 20 characters')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
];

// ─── POST /api/contact ────────────────────────────────────────────────────────
/**
 * Submit a new contact message
 * Public route — anyone can submit the form
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully! We will get back to you soon.',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit contact form',
    });
  }
};

// ─── GET /api/contact ─────────────────────────────────────────────────────────
/**
 * Get all contact messages — admin only
 * Supports pagination: ?page=1&limit=10
 * Supports search: ?search=keyword
 * Supports sorting: ?sort=newest|oldest
 */
const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sort = req.query.sort || 'newest';

    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Sort order
    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [messages, total] = await Promise.all([
      ContactMessage.find(searchFilter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit),
      ContactMessage.countDocuments(searchFilter),
    ]);

    // Analytics: messages per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const analytics = await ContactMessage.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: messages,
      analytics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch messages',
    });
  }
};

// ─── DELETE /api/contact/:id ──────────────────────────────────────────────────
/**
 * Delete a contact message by ID — admin only
 */
const deleteContact = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete message',
    });
  }
};

// ─── PATCH /api/contact/:id/read ─────────────────────────────────────────────
/**
 * Mark a message as read — admin only
 */
const markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitContact,
  getContacts,
  deleteContact,
  markAsRead,
  contactValidation,
};
