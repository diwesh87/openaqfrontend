# Quick Start Guide

## Running the Dashboard

### Method 1: Manual Start (Recommended)

1. **Terminal 1 - Start Backend:**
   ```bash
   cd backend
   python3 main.py
   ```
   Backend will run on http://localhost:8000

2. **Terminal 2 - Start Frontend:**
   ```bash
   npm run dev
   ```
   Dashboard will open at http://localhost:5173

### Method 2: Using Start Script

```bash
./start.sh
```
Then in another terminal:
```bash
npm run dev
```

## First Steps

1. **Select a Country**: Use the dropdown in the top navigation
   - Choose from: India, USA, UK, Germany, Brazil, China, Japan, Australia

2. **Select a City**: After choosing a country, select a city from the filtered list

3. **Choose Time Range**: Toggle between Today / 7 Days / 30 Days for historical data

4. **Explore Sections**: Use the sidebar to navigate through:
   - **Overview**: National statistics and city rankings
   - **City Deep Dive**: Detailed analysis for the selected city
   - **Map & Sensors**: Geographic visualization of monitoring stations
   - **Trends & Comparison**: Compare two cities side-by-side
   - **Health & Lifestyle**: Health recommendations based on air quality
   - **About**: Learn about data sources and methodology

## Key Features

### Interactive Elements
- **Info Icons (i)**: Hover over any metric to learn what it means
- **Sortable Tables**: Click column headers to sort
- **Search**: Filter cities by name in the Overview section
- **Charts**: All charts are interactive with hover tooltips

### Understanding Air Quality

**AQI Categories:**
- 0-50: Good (Green)
- 51-100: Moderate (Yellow)
- 101-150: Unhealthy for Sensitive Groups (Orange)
- 151-200: Unhealthy (Red)
- 201-300: Very Unhealthy (Dark Red)
- 301+: Hazardous (Maroon)

**Pollutants Tracked:**
- PM2.5: Fine particles < 2.5 micrometers
- PM10: Coarse particles
- NO2: Nitrogen dioxide
- O3: Ozone
- CO: Carbon monoxide
- SO2: Sulfur dioxide

### Health Recommendations

The Health & Lifestyle section provides personalized guidance:
- Walking safety
- Running conditions
- Outdoor play recommendations for children
- Cycling conditions
- Specific advice for sensitive groups, elderly, and asthma patients

## API Endpoints

If you want to use the backend API directly:

- GET http://localhost:8000/api/countries
- GET http://localhost:8000/api/cities?country=IN
- GET http://localhost:8000/api/city/New%20Delhi/summary?country=IN
- GET http://localhost:8000/api/city/New%20Delhi/history?country=IN&days=30
- GET http://localhost:8000/api/insights?country=IN&city=New%20Delhi

View all endpoints: http://localhost:8000/docs

## Troubleshooting

**Backend won't start:**
- Ensure Python 3.9+ is installed
- Install dependencies: `cd backend && pip install -r requirements.txt`

**Frontend won't start:**
- Ensure Node.js 18+ is installed
- Install dependencies: `npm install`

**Port already in use:**
- Backend (8000): Change the port in `backend/main.py`
- Frontend (5173): Vite will automatically try the next available port

**Data not loading:**
- Ensure backend is running on http://localhost:8000
- Check browser console for errors
- Verify `.env` file has `VITE_API_BASE_URL=http://localhost:8000`

## Development

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Type checking:**
```bash
npm run typecheck
```

**Linting:**
```bash
npm run lint
```

## Sample Data

The dashboard includes rich sample data for:
- 8 countries
- 20+ major cities
- 30 days of historical trends
- Multiple monitoring stations per city

No API key needed - it works out of the box!

## Mobile Access

The dashboard is fully responsive. Access it on your phone by:
1. Ensure your phone is on the same network as your development machine
2. Find your local IP (e.g., 192.168.1.100)
3. Access: http://YOUR_IP:5173

Enjoy monitoring global air quality!
