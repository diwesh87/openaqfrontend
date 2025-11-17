# Frontend Setup Guide

Complete setup guide for the OpenAQ Global Air Dashboard Frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/diwesh87/openaqfrontend.git
cd openaqfrontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- Recharts
- React Leaflet
- And more...

### 3. Environment Variables (Optional)

Create a `.env` file in the `frontend` directory:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
```

**Note**: 
- For local development, this is optional if your backend runs on `http://localhost:8000`
- For production (Vercel), set this in the Vercel dashboard
- **Important**: Do NOT include a trailing slash in the URL

### 4. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Open in Browser

Navigate to `http://localhost:5173` in your browser.

## Detailed Setup

### Step-by-Step Installation

#### 1. Verify Node.js Installation

```bash
node --version
# Should be v18 or higher

npm --version
# Should be v9 or higher
```

#### 2. Install Project Dependencies

```bash
npm install
```

This process may take a few minutes. You should see output like:
```
added 500+ packages, and audited 501 packages in 30s
```

#### 3. Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list --depth=0
```

#### 4. Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.4.8  ready in 430 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).

### Build

```bash
npm run build
```
Creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```
Previews the production build locally (run `npm run build` first).

### Linting

```bash
npm run lint
```
Runs ESLint to check for code quality issues.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ErrorMessage.tsx
│   │   ├── Header.tsx
│   │   ├── InfoTooltip.tsx
│   │   ├── KPICard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Sidebar.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── lib/              # Utilities and API client
│   │   ├── api.ts        # API client functions
│   │   └── utils.ts      # Helper functions
│   ├── sections/         # Main dashboard sections
│   │   ├── AboutSection.tsx
│   │   ├── DeepDiveSection.tsx
│   │   ├── HealthSection.tsx
│   │   ├── MapSection.tsx
│   │   ├── OverviewSection.tsx
│   │   └── TrendsSection.tsx
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── .env                  # Environment variables (not in git)
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` | No (for local dev) |

### Tailwind CSS

The project uses Tailwind CSS with custom configuration:
- Dark mode: `class` strategy
- Custom neon colors for dark mode
- Custom glow effects

Configuration file: `tailwind.config.js`

### TypeScript

TypeScript is configured with strict mode enabled. Configuration file: `tsconfig.json`

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Option 1: Kill the process using the port
# On macOS/Linux:
lsof -ti:5173 | xargs kill

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Option 2: Use a different port
npm run dev -- --port 3000
```

### Module Not Found Errors

If you see module not found errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

If the build fails:

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install

# Try building again
npm run build
```

### API Connection Issues

If the frontend can't connect to the backend:

1. **Check backend is running**: Ensure backend is running on `http://localhost:8000`
2. **Check environment variable**: Verify `VITE_API_BASE_URL` is set correctly
3. **Check CORS**: Ensure backend allows requests from `http://localhost:5173`
4. **Check browser console**: Look for CORS or network errors

### Dark Mode Not Working

If dark mode toggle doesn't work:

1. Check browser console for errors
2. Verify `ThemeContext` is properly set up
3. Ensure Tailwind dark mode is configured correctly
4. Clear browser cache and reload

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes to files are reflected immediately without full page reload.

### Browser DevTools

- **React DevTools**: Install browser extension for React component inspection
- **Network Tab**: Monitor API requests
- **Console**: Check for errors and warnings

### Code Formatting

The project uses ESLint for code quality. Run before committing:

```bash
npm run lint
```

### Type Checking

TypeScript provides type checking. Check for type errors:

```bash
npx tsc --noEmit
```

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

### Deploy to Vercel

1. **Connect GitHub repository** to Vercel
2. **Set environment variables**:
   - `VITE_API_BASE_URL`: Your backend API URL
3. **Deploy**: Vercel will automatically deploy on push to main branch

See `README.md` for more deployment details.

## Next Steps

- Read the [Contributing Guide](CONTRIBUTING.md)
- Check the [README.md](README.md) for more information
- Explore the codebase starting with `src/App.tsx`

## Support

If you encounter issues:
1. Check this guide
2. Review the README.md
3. Open an issue on GitHub
4. Check existing issues for solutions

