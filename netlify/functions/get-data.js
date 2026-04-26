const connectDB = require('./utils/db');
const { verifyToken } = require('./utils/auth');
const User = require('../../models/User');
const Bill = require('../../models/Bill');
const Group = require('../../models/Group');
const Installment = require('../../models/Installment');

exports.handler = async (event) => {
    try {
        await connectDB();
        const decodedToken = await verifyToken(event);
        const user = await User.findOne({ firebaseId: decodedToken.uid }).populate('friends');
        
        if (!user) {
            return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
        }

        const bills = await Bill.find({ userId: user._id }).sort({ date: -1 });
        const groups = await Group.find({ ownerId: user._id });
        const installments = await Installment.find({ userId: user._id });

        return {
            statusCode: 200,
            body: JSON.stringify({
                user,
                friends: user.friends,
                bills,
                groups,
                installments
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
