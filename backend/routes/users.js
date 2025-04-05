// routes/users.js
import express from 'express';
import multer from 'multer';
import User from '../Models/User.js';

// Setup multer for image upload
const upload = multer({
  dest: 'uploads/',  // Folder to store uploaded images
  limits: { fileSize: 5 * 1024 * 1024 },  // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if (ext !== 'jpeg' && ext !== 'jpg' && ext !== 'png') {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

const router = express.Router();

// User registration with image upload
router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience } = req.body;
    const avatarPath = req.file ? req.file.filename : '';  // Store the image file name

    const newUser = new User({
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      file: avatarPath,  // Save the avatar image file name
    });

    await newUser.save();
    res.status(200).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Get all users (for admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);  // Return the user data including avatar file name
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
