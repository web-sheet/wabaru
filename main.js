import express from 'express';
import fetch from 'node-fetch';
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public')); 
app.get('/api/qrcode', (req, res) => {
    if (app.locals.qrCode) {
        res.json({ qrCode: app.locals.qrCode });
    } else {
        res.status(404).json({ message: 'QR code not available yet.' });
    }
});

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

client.initialize();
export default app;
