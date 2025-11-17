# OpenAQ Global Air Dashboard - Frontend

An interactive, real-time air quality dashboard built with React, TypeScript, and Vite. This frontend application provides beautiful visualizations of air quality data from around the world using the OpenAQ API.

## 🌟 Features

- **Real-time Air Quality Data**: Fetches live data from OpenAQ API
- **Interactive Visualizations**: Charts, graphs, and maps powered by Recharts and Leaflet
- **Dark Mode**: Beautiful fluorescent/neon-themed dark mode with smooth transitions
- **Multi-Country Support**: View air quality data for countries worldwide
- **City Deep Dive**: Detailed analysis for individual cities
- **Trend Analysis**: Historical data visualization with customizable time ranges
- **Health Insights**: Personalized health recommendations based on air quality
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Recharts** - Chart library
- **React Leaflet** - Interactive maps
- **Lucide React** - Icon library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd openaq-dashboard/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file (optional - backend handles API key)
   # VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

This frontend is designed to be deployed on **Vercel**.

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

   Or connect your GitHub repository to Vercel for automatic deployments.

3. **Environment Variables**
   - Set `VITE_API_URL` to your backend API URL (e.g., `https://your-backend.railway.app`)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Theme, etc.)
│   ├── lib/            # Utilities and API client
│   ├── sections/       # Main dashboard sections
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
```

## 🎨 Theming

The application supports both light and dark modes with a beautiful fluorescent/neon color scheme:

- **Light Mode**: Clean, modern design with blue accents
- **Dark Mode**: Dark background with neon cyan (#00ffff) highlights

Toggle between themes using the theme switcher in the header.

## 🔌 API Integration

The frontend communicates with the backend API for all data operations:

- `/api/countries` - Get list of countries
- `/api/cities?country=XX` - Get cities for a country
- `/api/city/{city}/summary?country=XX` - Get city summary
- `/api/city/{city}/history?country=XX&days=30` - Get historical data
- `/api/heatmap?country=XX` - Get heatmap data
- `/api/insights?country=XX&city=XXX` - Get health insights

## 🤝 Contributing

This is an open-source project! Contributions are welcome. Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [OpenAQ](https://openaq.org/) for providing air quality data
- All contributors who help improve this dashboard

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.
