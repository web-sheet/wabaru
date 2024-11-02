import express from 'express';
import fetch from 'node-fetch';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

const client = new Client();

client.on('qr', async (qr) => {
    try {
        const qrCode = await qrcode.toDataURL(qr);
        app.locals.qrCode = qrCode;  
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Update the endpoint to include /api/
app.get('/api/qrcode', (req, res) => {
    if (app.locals.qrCode) {
        res.json({ qrCode: app.locals.qrCode });
    } else {
        res.status(404).json({ message: 'QR code not available yet.' });
    }
});

// Other event handlers remain unchanged...

client.initialize();


// Vercel will handle the serverless function, so we don't need to listen on a specific port
export default app;
