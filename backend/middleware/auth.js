const jwt = require('jsonwebtoken');

// This is our bouncer function
function auth(req, res, next) {
    // 1. Ask to see the wristband (Look in the headers)
    const authHeader = req.header('Authorization');

    // 2. If they didn't bring a wristband, kick them out immediately
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Tokens usually look like "Bearer eyJhbGciOi...", so we grab just the token part
        const token = authHeader.split(' ')[1]; 
        
        // 3. Scan the wristband with our secret key to make sure it's real
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. It's real! Attach their user ID to the request so the VIP room knows who they are
        req.user = decoded;
        
        // 5. Open the door to the VIP room!
        next();
    } catch (error) {
        // If the token is fake or expired
        res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }
}

module.exports = auth;