# TweetLingo Chrome Extension

Chrome Extension for analyzing and learning vocabulary from X (Twitter) tweets.

## Features

- 🔍 One-click tweet analysis from X/Twitter pages
- 📚 Automatic word extraction (nouns, verbs, adjectives, adverbs)
- 💾 Auto-save to your TweetLingo vocabulary
- 🔄 Notion integration support
- 📱 Side panel for detailed word view

## Development

### Prerequisites

- Node.js 18+
- Chrome browser

### Setup

```bash
# Install dependencies
npm install

# Start development mode (with hot reload)
npm run dev

# Build for production
npm run build
```

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `chrome-extension/dist` folder

### Project Structure

```
chrome-extension/
├── src/
│   ├── background/          # Service Worker
│   ├── content-script/      # X page integration
│   ├── popup/               # Extension popup UI
│   ├── sidebar/             # Side panel UI
│   └── shared/              # Shared utilities
│       ├── api-client.ts    # API communication
│       ├── storage.ts       # Chrome storage wrapper
│       ├── types.ts         # TypeScript types
│       └── utils.ts         # Helper functions
├── manifest.json            # Extension manifest
├── package.json
└── vite.config.ts           # Build configuration
```

## Usage

1. Visit any tweet on X/Twitter
2. Click the "Analyze" button on the tweet
3. View analyzed words in the side panel
4. Words are automatically saved if auto-save is enabled
5. Access recent words from the extension popup

## Architecture

- **Manifest V3**: Uses latest Chrome Extension standards
- **React 19**: Modern UI components
- **TypeScript**: Type-safe development
- **Vite**: Fast build and HMR

## License

MIT
