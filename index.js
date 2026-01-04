import express from 'express';
import https from 'https';

const app = express();
const PORT = 3000;

app.use(express.static('.'));

app.get('/test', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        // Use multiple test files for better accuracy
        const testFiles = [
            'https://speed.cloudflare.com/__down?bytes=25000000',
            'https://speed.cloudflare.com/__down?bytes=25000000',
            'https://speed.cloudflare.com/__down?bytes=25000000'
        ];

        let totalBytes = 0;
        const startTime = Date.now();
        let lastUpdateTime = startTime;
        let lastBytes = 0;

        for (const url of testFiles) {
            await new Promise((resolve, reject) => {
                https.get(url, (response) => {
                    response.on('data', (chunk) => {
                        totalBytes += chunk.length;
                        const now = Date.now();
                        
                        // Update speed every 200ms
                        if (now - lastUpdateTime > 200) {
                            const timeDiff = (now - lastUpdateTime) / 1000;
                            const bytesDiff = totalBytes - lastBytes;
                            const speedMbps = (bytesDiff * 8) / (timeDiff * 1000000);
                            
                            res.write(`data: ${JSON.stringify({ progress: speedMbps.toFixed(2) })}\n\n`);
                            
                            lastUpdateTime = now;
                            lastBytes = totalBytes;
                        }
                    });

                    response.on('end', resolve);
                    response.on('error', reject);
                });
            });
        }

        // Calculate final average speed
        const totalTime = (Date.now() - startTime) / 1000;
        const finalSpeed = (totalBytes * 8) / (totalTime * 1000000);
        
        res.write(`data: ${JSON.stringify({ speed: finalSpeed.toFixed(2), done: true })}\n\n`);
        res.end();
    } catch (error) {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
