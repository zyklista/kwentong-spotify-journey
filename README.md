# Diary of an OFW – Kwentong Spotify Journey

> Real talk, real stories, real solutions para sa mga Overseas Filipino Workers. Mga kwento ng pagtitiis, tagumpay, at pag-asa mula sa mga tunay na OFW.

This is a modern web application built with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**. It features a podcast/blog platform for OFWs, with interactive forms, media sections, and community engagement tools.

## Features

- 🎙️ Spotify podcast episode integration
- 📚 Blog posts and resource guides for OFWs
- 📺 YouTube and media sections
- 📝 Contact and newsletter signup forms (Supabase + Brevo)
- 📊 Survey and feedback widgets
- 💬 Chatbot and interactive UI components
- 📱 Responsive, mobile-first design
- 🛡️ GDPR-compliant cookie and privacy policy
- 🌙 Modern UI with shadcn/ui and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Install dependencies

```bash
npm install
# or
bun install
```

### Development server

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for production

```bash
npm run build
# or
bun run build
```

### Lint

```bash
npm run lint
```

## Project Structure

- `src/` – Main source code
  - `components/` – UI and page components
  - `pages/` – Top-level pages (Index, Blog, Contact, etc.)
  - `integrations/supabase/` – Supabase client and types
  - `utils/` – Utility functions
- `api/` – Serverless/contact form endpoints
- `public/` – Static assets

## Deployment

This project is ready for deployment on Vercel, Netlify, or any static hosting provider. See `vercel.json` for Vercel config.

## Credits

- Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Supabase](https://supabase.com/), [shadcn/ui](https://ui.shadcn.com/)
- Podcast and content: Diary of an OFW

## License

MIT
