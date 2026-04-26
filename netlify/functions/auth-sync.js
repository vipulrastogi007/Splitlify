const connectDB = require('./utils/db');
const { verifyToken } = require('./utils/auth');
const User = require('../../models/User');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await connectDB();
        const decodedToken = await verifyToken(event);
        const { uid, email, name, picture } = decodedToken;

        let user = await User.findOne({ firebaseId: uid });

        if (!user) {
            user = new User({
                firebaseId: uid,
                email: email || '',
                name: name || 'New User',
                avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}`,
                settings: {
                    darkMode: false,
                    appLock: false
                }
            });
            await user.save();
        } else {
            // Update profile if changed
            let updated = false;
            if (name && user.name !== name) { user.name = name; updated = true; }
            if (picture && user.avatar !== picture) { user.avatar = picture; updated = true; }
            if (updated) await user.save();
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        };
    } catch (error) {
        console.error('Auth Sync Error:', error);
        return {
            statusCode: error.message === 'Unauthorized' ? 401 : 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
