# Smart Farm Advisor

An AI-powered agricultural advisory system that provides personalized farming recommendations and insights to improve agricultural productivity and sustainability.

## Features

- 🌱 **Crop Recommendations**: Get AI-powered crop suggestions based on:
  - Soil conditions
  - Weather patterns
  - Season
  - Market trends
  - Historical data

- 🔍 **Disease Detection**: 
  - Upload plant images for real-time disease detection
  - AI-powered analysis using TensorFlow.js
  - Instant treatment recommendations
  - Disease prevention tips

- ⛅ **Weather Monitoring**:
  - Real-time weather updates
  - Weather forecasts
  - Alerts for adverse conditions
  - Historical weather data analysis

- 📊 **Farm Analytics**:
  - Crop performance tracking
  - Yield predictions
  - Resource utilization insights
  - Economic analysis

- 🤝 **Community Features**:
  - Connect with agricultural experts
  - Share experiences
  - Discussion forums
  - Best practices exchange

## Tech Stack

- **Frontend**:
  - React.js
  - Material-UI
  - TensorFlow.js
  - Chart.js for analytics
  - Socket.io for real-time updates

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose ODM
  - JWT Authentication

- **AI/ML**:
  - TensorFlow for disease detection
  - Machine Learning models for crop recommendations
  - Weather prediction algorithms

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-farm-advisor.git
   cd smart-farm-advisor
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   npm run server

   # Start frontend server (in a new terminal)
   cd client
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
smart-farm-advisor/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Helper functions
└── README.md
```

## API Documentation

### Crop Recommendations

```http
POST /api/crops/recommendations
```

Request body:
```json
{
  "temperature": 25,
  "rainfall": 1000,
  "pH": 6.5,
  "season": "Kharif",
  "soilType": "Clay"
}
```

### Disease Detection

```http
POST /api/diseases/detect
```
- Accepts multipart form data with image file

### Weather Data

```http
GET /api/weather/forecast
```
- Returns 7-day weather forecast for the specified location

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by OpenWeatherMap API
- Plant disease detection model trained on PlantVillage dataset
- Agricultural data sourced from various government agricultural departments 