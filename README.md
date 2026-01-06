# Testing Net Speed

A fast and reliable internet speed test application for Indian users. Test your Jio, Airtel, Vodafone, or any ISP connection speed instantly with location and carrier detection.

## Features

- **Real-time Speed Testing**: Download and upload speed testing using Cloudflare servers
- **Automatic Location Detection**: City, region, country detection
- **ISP/Carrier Display**: Shows provider name (Jio, Airtel, Vodafone, etc.)
- **Real-time Speed Graph**: Live visualization of download and upload speeds with min/avg/max statistics
- **Quality Score**: Intelligent connection quality rating (0-100) with performance recommendations
- **Share Results**: Generate and share beautiful speed test result images
- **Progressive Web App (PWA)**: Installable on mobile and desktop devices
- **IP & Timezone Info**: Complete network information display
- **Clean, Modern UI**: Responsive blue gradient design
- **No API Keys Required**: Free to use, no registration needed

## Technologies Used

- **Runtime**: Node.js v22+
- **Framework**: Express.js
- **APIs**: Cloudflare Speed Test, IP-API.com
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/PatelAbhay550/testingspeed.git
cd testingspeed
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the server:
```bash
pnpm start
# or
npm start
```

4. Open your browser and visit:
```
http://localhost:3000
```

## How It Works

1. **Location Detection**: Uses IP-API.com to detect user location and ISP based on IP address
2. **Download Test**: Downloads data from Cloudflare's speed test endpoint with real-time graph updates every 200ms
3. **Upload Test**: Uploads 2MB chunks to httpbin.org with live speed visualization
4. **Quality Score**: Calculates connection quality (0-100) based on download (60% weight) and upload (40% weight) speeds:
   - 90-100: Excellent (Perfect for 4K streaming, gaming, video calls)
   - 70-89: Good (Great for HD streaming and online gaming)
   - 50-69: Fair (Suitable for browsing and SD video)
   - 30-49: Poor (Basic browsing only, streaming may buffer)
   - 0-29: Very Poor (Very slow, consider upgrading)
5. **Share Results**: Generates a 600x800px image with download/upload speeds and quality score
6. **PWA Features**: Service worker caching for offline capability and fast loading

## API Endpoints

- `GET /` - Main speed test interface with PWA support
- `GET /blog` - SEO-optimized guide on using the speed test
- `GET /api/location` - Returns user location, ISP, timezone, and IP address
- `GET /public/manifest.json` - PWA manifest
- `GET /public/sw.js` - Service worker for offline capability

## Dependencies

- `express`: ^5.2.1

## Project Structure

```
mcq/
├── index.js          # Express server with location API
├── index.html        # Main speed test interface
├── blog.html         # SEO blog page
├── package.json      # Project dependencies
├── vercel.json       # Vercel deployment config with PWA support
├── public/          # Static assets
│   ├── app.js        # Client-side JavaScript (speed testing, charts, sharing)
│   ├── app-source.js # Unminified source code
│   ├── sw.js         # Service worker for PWA
│   ├── manifest.json # PWA manifest
│   ├── icon-192.svg  # PWA icon 192x192
│   ├── icon-512.svg  # PWA icon 512x512
│   ├── favicon.svg   # Browser favicon
│   └── favicon.ico   # Fallback favicon
└── README.md        # This file
```

## Deployment

Deploy to Vercel:
```bash
vercel
```

The `vercel.json` configuration is already included for seamless deployment.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Cloudflare Speed Test](https://speed.cloudflare.com/) - Speed testing infrastructure
- [IP-API](https://ip-api.com/) - Free IP geolocation API
- [Express.js](https://expressjs.com/) - Web framework
- [Node.js](https://nodejs.org/) - Runtime environment

## Author

**Abhay Patel**
- GitHub: [@PatelAbhay550](https://github.com/PatelAbhay550)
- Email: patelabhay550@gmail.com

## Live Demo

Visit: [https://www.testingnetspeed.vercel.app/](https://www.testingnetspeed.vercel.app/)

---

Made for Indian internet users to easily test their connection speeds.
