import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get user location
app.get('/api/location', async (req, res) => {
    try {
        // Get IP address from request
        let ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress;
        
        // Clean up IPv6 localhost format
        if (ip === '::1' || ip === '127.0.0.1' || ip?.includes('::ffff:127.0.0.1')) {
            // For localhost, fetch the user's real public IP first
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            ip = ipData.ip;
        }
        
        // Use ip-api.com (free, no auth required, 45 requests/minute)
        const apiUrl = `http://ip-api.com/json/${ip}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === 'fail') {
            throw new Error(data.message || 'Unable to fetch location');
        }
        
        res.json({
            success: true,
            location: {
                country: data.country,
                city: data.city,
                region: data.regionName,
                timezone: data.timezone,
                ip: data.query,
                isp: data.isp || data.org || 'Unknown'
            }
        });
    } catch (error) {
        console.error('Location API error:', error.message);
        res.json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
