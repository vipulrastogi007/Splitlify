const connectDB = require('./utils/db');
const { verifyToken } = require('./utils/auth');
const User = require('../../models/User');
const Bill = require('../../models/Bill');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await connectDB();
        const decodedToken = await verifyToken(event);
        const user = await User.findOne({ firebaseId: decodedToken.uid });
        
        if (!user) return { statusCode: 404, body: 'User not found' };

        const billData = JSON.parse(event.body);
        const newBill = new Bill({
            ...billData,
            userId: user._id
        });

        await newBill.save();

        return {
            statusCode: 201,
            body: JSON.stringify(newBill)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
