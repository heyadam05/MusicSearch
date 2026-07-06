# Music Search

A modern, responsive music discovery application powered by the iTunes Search API.
Search for songs, albums, and music videos, listen to 30-second previews, explore
album tracklists, and save favorite tracks directly in the browser.

## Live Demo

[Open Music Search](https://heymusicsearch.netlify.app/)

## Features

- Search for songs, albums, artists, and music videos
- Dynamic trending searches powered by the Apple Top Songs chart
- Filter results by media type, genre, and release year
- Sort results by relevance, title, artist, or release date
- Paginated search results with URL-based state
- Detailed album pages with metadata and complete tracklists
- Global audio player with playback controls, seeking, and volume adjustment
- 30-second song and music video previews
- Favorites stored safely in `localStorage`
- Light and dark themes with saved user preference
- Responsive layouts for mobile, tablet, and desktop
- Keyboard shortcut: press `/` to open or focus music search
- Loading, empty, error, and not-found states
- Accessible controls, focus styles, and reduced-motion support

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Vite](https://vite.dev/)
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)

## Project Structure

```text
src/
├── app/          # Application-level providers
├── components/   # Reusable layout, music, and search components
├── config/       # Environment-based application configuration
├── context/      # Audio player, favorites, and theme state
├── hooks/        # Reusable data and browser hooks
├── layouts/      # Shared page layout
├── pages/        # Route-level page components
├── router/       # createBrowserRouter configuration
├── services/     # iTunes API and trending chart requests
├── styles/       # Global styles and shared layout rules
├── types/        # Shared TypeScript models
├── utils/        # Formatting utilities
└── main.tsx      # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
git clone <your-repository-url>
cd musicsearch
npm install
```

Create a local environment file from the provided example:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The terminal will display the local URL, usually `http://localhost:5173`.

## Environment Variables

The social links are optional. When a value is missing, its corresponding link is
not rendered.

```env
VITE_GITHUB_URL=https://github.com/your-username/music-search
VITE_LINKEDIN_URL=https://www.linkedin.com/in/your-username
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview the production build locally |

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

The optimized production files are generated in the `dist` directory.

## Data and Persistence

Music metadata, artwork, previews, albums, and tracklists are provided by Apple
through the public iTunes endpoints. Favorite tracks, recent searches, and theme
preferences are stored locally in the user's browser. The application does not
require an account or a custom backend.

## Acknowledgements

- Music data and artwork are provided by Apple.
- Preview availability may vary by track, media type, and region.
