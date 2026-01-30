# Weather Forecast Application

A full-stack weather forecast application built with React and Node.js. Users can search for cities, view current weather conditions and a 5-day forecast, with user actions logged and persisted on the backend.

## Features

### Front-end (React)
- **Responsive layout** using Bootstrap and custom SCSS (mobile, tablet, desktop)
- **Searchable city dropdown** powered by Open-Meteo Geocoding API with custom scrollbar
- **Most viewed cities** — browser stores and displays the top 3 most viewed cities (localStorage)
- **Current weather** — displays temperature, feels-like, humidity, wind speed, wind direction, and pressure
- **5-day forecast** — daily max/min temperature, weather description, wind speed, and precipitation
- **Modern dark theme** — glassmorphism cards, gradient text, animated background

### Back-end (Node.js)
- **Express** REST API to log user actions
- Logs each city selection with timestamp to the **console**
- **PostgreSQL database** persists all user actions across server restarts
- `POST /api/log` — log a city selection
- `GET /api/logs` — retrieve all logged actions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-end | React, React-Select, Bootstrap, SCSS |
| Back-end | Node.js, Express |
| Database | PostgreSQL (pg) |
| API | [Open-Meteo](https://open-meteo.com/en/docs) (weather + geocoding) |
| Testing | Jest, React Testing Library, Supertest |
| Deployment | Docker, Docker Compose |

## Getting Started

### Prerequisites
- Node.js 16+
- npm
- PostgreSQL 14+ (or use Docker Compose)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Weather

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

**Start the backend** (runs on port 5000):
```bash
# Set the database connection string (adjust credentials as needed)
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weather

cd backend
npm start
```

**Start the frontend** (runs on port 3000):
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

**Backend tests (6 tests):**
```bash
cd backend
npm test
```

**Frontend tests (9 tests):**
```bash
cd frontend
npm test
```

## Docker Deployment

### Using Docker Compose (recommended)

```bash
docker-compose up --build
```

This starts both services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

PostgreSQL data is persisted in a Docker volume (`pgdata`).

### Individual Docker builds

```bash
# Backend
cd backend
docker build -t weather-backend .
docker run -p 5000:5000 weather-backend

# Frontend
cd frontend
docker build -t weather-frontend --build-arg REACT_APP_BACKEND_URL=http://localhost:5000 .
docker run -p 3000:80 weather-frontend
```

### Cloud Deployment (IBM Cloud)

Deploy using [IBM Cloud Code Engine](https://cloud.ibm.com/codeengine):

```bash
# Login to IBM Cloud
ibmcloud login

# Target a resource group
ibmcloud target -g Default

# Create a Code Engine project
ibmcloud ce project create --name weather-app
ibmcloud ce project select --name weather-app

# Build and deploy backend
ibmcloud ce app create --name weather-backend \
  --build-source ./backend \
  --port 5000

# Get the backend URL
BACKEND_URL=$(ibmcloud ce app get --name weather-backend --output url)

# Build and deploy frontend
ibmcloud ce app create --name weather-frontend \
  --build-source ./frontend \
  --port 80 \
  --build-env-from-configmap REACT_APP_BACKEND_URL=$BACKEND_URL
```

## Project Structure

```
Weather/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app & routes
│   │   ├── logger.js          # Action logging module
│   │   ├── database.js        # SQLite database module
│   │   └── server.test.js     # Backend unit tests (6 tests)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CitySearch.js          # Searchable city dropdown
│   │   │   ├── CurrentWeather.js      # Current weather display
│   │   │   ├── Forecast.js            # 5-day forecast display
│   │   │   ├── MostViewedCities.js    # Most viewed cities chips
│   │   │   └── *.test.js              # Component unit tests (9 tests)
│   │   ├── services/
│   │   │   ├── weatherApi.js    # Open-Meteo API client
│   │   │   ├── backendApi.js    # Backend logging client
│   │   │   └── storage.js       # localStorage helpers
│   │   ├── styles/
│   │   │   └── main.scss        # Custom SCSS styles
│   │   ├── App.js               # Root component
│   │   └── index.js             # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

### POST /api/log
Log a user action. Persisted to PostgreSQL database.

**Request body:**
```json
{ "city": "Vilnius, Lithuania", "action": "CITY_SELECTED" }
```

**Response:**
```json
{ "id": 1, "timestamp": "2026-01-30T12:00:00.000Z", "city": "Vilnius, Lithuania", "action": "CITY_SELECTED" }
```

### GET /api/logs
Returns all logged actions from the database as a JSON array (newest first).

## Requirements Checklist

### Functional Requirements
- [x] Responsive layout
- [x] Searchable dropdown to select city
- [x] Browser stores 3 most viewed cities
- [x] Page displays and suggests 3 most viewed cities
- [x] Current weather conditions (temperature, wind, humidity, etc.)
- [x] 5-day forecast
- [x] Backend logs user actions to console with timestamp and city

### Technical Requirements
- [x] Front-end: React
- [x] Back-end: Node.js
- [x] Bootstrap for UI components
- [x] Custom styling using SCSS
- [x] Source code in GitHub
- [x] Documentation (this README)

### Lucky Points
- [x] Unit tests (15 total: 6 backend + 9 frontend)
- [x] User actions saved to PostgreSQL database
- [x] Docker + Docker Compose ready for cloud deployment
