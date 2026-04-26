const connectDB = require('./utils/db');
const { verifyToken } = require('./utils/auth');
const Bill = require('../../models/Bill');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        await connectDB();
        await verifyToken(event);
        
        const { billId } = JSON.parse(event.body);
        const bill = await Bill.findByIdAndUpdate(billId, { status: 'settled' }, { new: true });

        if (!bill) return { statusCode: 404, body: 'Bill not found' };

        return {
            statusCode: 200,
            body: JSON.stringify(bill)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
