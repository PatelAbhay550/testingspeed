# Testing Net Speed

A fast and reliable internet speed test application for Indian users. Test your Jio, Airtel, Vodafone, or any ISP connection speed instantly with location and carrier detection.

## Features

- Real-time internet speed testing using Cloudflare servers
- Automatic location detection (city, region, country)
- ISP/Carrier name display (Jio, Airtel, Vodafone, etc.)
- IP address and timezone information
- Clean, responsive interface
- No external API keys required

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
2. **Speed Test**: Downloads data from Cloudflare's speed test endpoint to measure download speed
3. **Real-time Updates**: Shows speed updates every 200ms during testing
4. **Accurate Results**: Runs 3 sequential downloads and calculates average speed

## API Endpoints

- `GET /` - Main speed test interface
- `GET /api/location` - Returns user location, ISP, timezone, and IP address

## Dependencies

- `express`: ^5.2.1

## Project Structure

```
testingnetseed/
├── index.js          # Express server with location API
├── index.html        # Main speed test interface
├── blog.html         # SEO blog page
├── package.json      # Project dependencies
├── public/          # Static assets
│   ├── favicon.svg
│   └── favicon.ico
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
