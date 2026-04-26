const Tesseract = require('tesseract.js');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { image } = JSON.parse(event.body); // base64 image
        if (!image) return { statusCode: 400, body: 'No image provided' };

        const { data: { text } } = await Tesseract.recognize(
            image,
            'eng',
            { logger: m => console.log(m) }
        );

        // Simple parsing logic
        const lines = text.split('\n');
        const items = [];
        let total = 0;

        lines.forEach(line => {
            // Match something like "Item Name 123.45"
            const match = line.match(/(.*?)\s+(\d+[\.,]\d{2})/);
            if (match) {
                const name = match[1].trim();
                const price = parseFloat(match[2].replace(',', '.'));
                if (name.toLowerCase() !== 'total' && name.toLowerCase() !== 'subtotal') {
                    items.push({ name, price, qty: 1 });
                } else if (name.toLowerCase() === 'total') {
                    total = price;
                }
            }
        });

        // If total not found by "total" keyword, use sum of items
        if (total === 0) {
            total = items.reduce((sum, item) => sum + item.price, 0);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ items, total })
        };
    } catch (error) {
        console.error('OCR Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
