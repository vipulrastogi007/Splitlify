const connectDB = require('./utils/db');
const { verifyToken } = require('./utils/auth');
const User = require('../../models/User');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await connectDB();
        const decodedToken = await verifyToken(event);
        const user = await User.findOne({ firebaseId: decodedToken.uid });
        
        const { action, friendEmail, friendId } = JSON.parse(event.body);

        if (action === 'add') {
            const friend = await User.findOne({ email: friendEmail });
            if (!friend) return { statusCode: 404, body: JSON.stringify({ error: 'User with this email not found. Tell them to join Splitlify!' }) };
            
            if (user.friends.includes(friend._id)) {
                return { statusCode: 400, body: JSON.stringify({ error: 'Already friends' }) };
            }

            user.friends.push(friend._id);
            await user.save();
            return { statusCode: 200, body: JSON.stringify(friend) };
        } else if (action === 'remove') {
            user.friends = user.friends.filter(id => id.toString() !== friendId);
            await user.save();
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 400, body: 'Invalid action' };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
