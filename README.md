<div align="center">

# Play Tab

<img src="https://api.iconify.design/mdi/tab.svg" width="64" height="64" alt="Tab Manager"/>

Browser tab and bookmark management extension. Raindrop.io-style UI with dark mode, drag-and-drop, and cloud sync.

**English** | [繁體中文](./README_zh-TW.md) | [简体中文](./README_zh-CN.md)

</div>

---

## Features

- **Three-Panel Layout** — Left sidebar (collections), main grid (bookmarks), right panel (open tabs)
- **Card View** — Rich bookmark cards with favicons, titles, and descriptions
- **Drag & Drop** — Drag tabs from right panel to save as bookmarks
- **Dark Mode** — Modern dark UI design
- **Chrome Extension** — Manifest V3 compliant

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS
- Chrome Extension API
- Supabase (optional cloud sync)

## Quickstart

```bash
# Install dependencies
npm install

# Dev mode
npm run dev

# Build
npm run build
```

## Load Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

## Project Structure

```
play_tab/
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # Service layer
│   └── utils/         # Utilities
├── docs/              # Documentation
└── public/            # Static assets
```

## Documentation

- [QUICKSTART.md](./QUICKSTART.md) — Quick start guide
- [docs/SETUP.md](./docs/SETUP.md) — Detailed setup
- [CLAUDE.md](./CLAUDE.md) — Project specification

## Status

- [x] Frontend architecture initialized
- [x] Three-panel layout implemented
- [x] Dark mode support
- [x] Chrome Extension base config
- [ ] Chrome Tabs API integration
- [ ] Drag & drop functionality
- [ ] Data persistence

---

## License

MIT

## Acknowledgements

Made with ❤️ by **Pauuulq87**
