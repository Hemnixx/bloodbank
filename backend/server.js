const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
const auth = require('./middleware/auth');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: ["https://bloodbank-git-main-hemnixxs-projects.vercel.app", "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.log('❌ Error connecting to MongoDB:', error.message));

// --- USER ROUTES ---

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

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login successful!', 
            token: token, 
            user: { name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

app.get('/api/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// --- EMERGENCY REQUEST ROUTES ---

app.post('/api/requests', auth, async (req, res) => {
    try {
        const { patientName, bloodGroupRequired, location, urgency } = req.body;

        const newRequest = new BloodRequest({
            requester: req.user.id, 
            patientName,
            bloodGroupRequired,
            location,
            urgency
        });
        
        await newRequest.save();

        res.status(201).json({ 
            success: true, 
            message: 'Blood request posted successfully!', 
            bloodRequest: newRequest 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to post request', error: error.message });
    }
});

app.get('/api/requests', async (req, res) => {
    try {
        // UPDATE: Now we fetch BOTH pending and accepted requests!
        const requests = await BloodRequest.find({ status: { $in: ['pending', 'accepted'] } })
            .populate('requester', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: requests.length, 
            data: requests 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error retrieving requests' });
    }
});

app.get('/api/my-requests', auth, async (req, res) => {
    try {
        const myRequests = await BloodRequest.find({ requester: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: myRequests.length,
            data: myRequests
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ✅ THIS IS THE FIX: The PUT route is now separated perfectly!
app.put('/api/requests/:id', auth, async (req, res) => {
    try {
        const updatedRequest = await BloodRequest.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true } 
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Emergency not found' });
        }

        res.json({ success: true, data: updatedRequest });
    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/requests/:id', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await BloodRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (request.requester.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this request!' });
        }

        await request.deleteOne();

        res.status(200).json({ success: true, message: 'Request successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));