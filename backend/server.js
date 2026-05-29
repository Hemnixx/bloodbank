const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Import the wristband maker
require('dotenv').config(); 
const User = require('./models/User');
const auth = require('./middleware/auth'); // 2. Import the bouncer

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.log('❌ Error connecting to MongoDB:', error.message));

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role, bloodGroup } = req.body;
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        const newUser = new User({ name, email, password: hashedPassword, role, bloodGroup });
        await newUser.save();
        
        res.status(201).json({ success: true, message: 'Secure user registered successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Registration failed!', error: error.message });
    }
});

// Login Route (Upgraded!)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password!' });
        }

        // 2. Create the VIP Wristband (Token)
        // We pack their unique ID inside the token so we always know who they are
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // The wristband expires in 1 day
        );

        // 3. Send the token back to the user
        res.status(200).json({ 
            success: true, 
            message: 'Login successful!', 
            token: token, // Here is your wristband!
            user: { name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});
// New VIP Route: Get User Profile
// Notice how we put the 'auth' bouncer right in the middle!
app.get('/api/profile', auth, async (req, res) => {
    try {
        // Because the bouncer let them in, we know req.user.id is legitimate
        // .select('-password') ensures we NEVER accidentally send the scrambled password back to the frontend!
        const user = await User.findById(req.user.id).select('-password');
        
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));