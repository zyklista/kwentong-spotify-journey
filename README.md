# Diary of an OFW - Kwentong Spotify Journey

A comprehensive web platform for Overseas Filipino Workers (OFW) featuring podcasts, blogs, resources, and community support.

## 🚀 Project Overview

This is a modern React/TypeScript application built with:
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Supabase (Database + Edge Functions)
- **Deployment**: Vercel
- **Content**: Spotify podcast integration, YouTube videos, blog posts

## 📁 Project Structure

```
kwentong-spotify-journey/
├── api/                          # Vercel serverless functions
│   └── contact-brevo.js         # Legacy contact form handler
├── public/                       # Static assets
│   ├── robots.txt
│   ├── site.webmanifest
│   └── sitemap.xml
├── scripts/                      # Build and deployment scripts
│   ├── deploy-media-sync.sh
│   ├── generate-sitemap.js
│   └── sync_youtube_to_supabase.py
├── src/
│   ├── assets/                   # Images and media files
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   ├── integrations/            # External service integrations
│   │   └── supabase/
│   ├── lib/                     # Utility libraries
│   ├── pages/                   # Route components
│   │   ├── blog/               # Blog post pages
│   │   ├── Index.tsx
│   │   ├── Connect.tsx
│   │   └── ...
│   ├── utils/                   # Utility functions
│   └── App.tsx                  # Main app component
├── supabase/
│   ├── functions/               # Edge Functions
│   │   └── contact_submissions/ # Contact form handler
│   └── migrations/              # Database migrations
└── package.json                 # Dependencies and scripts
```

## 🛠️ Key Features

### Frontend Components
- **Header/Navigation**: Responsive navigation with mobile menu
- **Hero Section**: Main landing area with call-to-action
- **Media Integration**: Spotify podcast and YouTube video embeds
- **Blog System**: Dynamic blog posts with routing
- **Contact Forms**: Multiple contact forms with validation
- **SEO Optimized**: Meta tags, structured data, sitemaps

### Backend Services
- **Supabase Database**: PostgreSQL database for content and forms
- **Edge Functions**: Serverless functions for form processing
- **Email Integration**: Brevo (Sendinblue) for marketing emails
- **Media Sync**: Automated content synchronization

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kwentong-spotify-journey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
# Deploy to Vercel
```

### Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy Edge Functions
supabase functions deploy contact_submissions
```

## 📊 Database Schema

### Tables
- `contact_submissions` - Contact form submissions
- `blog_posts` - Blog content
- `media_content` - Spotify/YouTube content
- `survey_responses` - User survey data

## 🔒 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Email Marketing
BREVO_API_KEY=your-brevo-api-key

# Analytics (optional)
GOOGLE_ANALYTICS_ID=your-ga-id
```

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run type-check      # TypeScript type checking

# Content Management
npm run sitemap         # Generate sitemap
```

## 🌐 Routes & Pages

- `/` - Homepage with hero, media, blogs
- `/connect` - Contact page with service inquiry form
- `/our-story` - About page
- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog posts
- `/survey` - User feedback survey
- `/privacy` - Privacy policy
- `/terms` - Terms and conditions

## 🔧 Edge Functions

### Contact Form Handler
**Location**: `supabase/functions/contact_submissions/index.ts`

Handles contact form submissions with:
- Form validation
- Database storage
- Email marketing integration
- Error handling

**Endpoint**: `https://your-project.supabase.co/functions/v1/contact_submissions`

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tailwind CSS utility classes
- Shadcn/ui component library
- Optimized for all screen sizes

## 🔍 SEO & Performance

- **Meta Tags**: Comprehensive SEO meta tags
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Auto-generated sitemap
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: WebP format, lazy loading
- **Bundle Analysis**: Build size monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions:
- Email: info@diaryofanofw.com
- Website: https://diaryofanofw.com/connect

---

**Built with ❤️ for the OFW community**
  
  ```sh
  brew install supabase/tap/supabase-beta
  brew link --overwrite supabase-beta
  ```
  
  To upgrade:

  ```sh
  brew upgrade supabase
  ```
</details>

<details>
  <summary><b>Windows</b></summary>

  Available via [Scoop](https://scoop.sh). To install:

  ```powershell
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  To upgrade:

  ```powershell
  scoop update supabase
  ```
</details>

<details>
  <summary><b>Linux</b></summary>

  Available via [Homebrew](https://brew.sh) and Linux packages.

  #### via Homebrew

  To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To upgrade:

  ```sh
  brew upgrade supabase
  ```

  #### via Linux packages

  Linux packages are provided in [Releases](https://github.com/supabase/cli/releases). To install, download the `.apk`/`.deb`/`.rpm`/`.pkg.tar.zst` file depending on your package manager and run the respective commands.

  ```sh
  sudo apk add --allow-untrusted <...>.apk
  ```

  ```sh
  sudo dpkg -i <...>.deb
  ```

  ```sh
  sudo rpm -i <...>.rpm
  ```

  ```sh
  sudo pacman -U <...>.pkg.tar.zst
  ```
</details>

<details>
  <summary><b>Other Platforms</b></summary>

  You can also install the CLI via [go modules](https://go.dev/ref/mod#go-install) without the help of package managers.

  ```sh
  go install github.com/supabase/cli@latest
  ```

  Add a symlink to the binary in `$PATH` for easier access:

  ```sh
  ln -s "$(go env GOPATH)/bin/cli" /usr/bin/supabase
  ```

  This works on other non-standard Linux distros.
</details>

<details>
  <summary><b>Community Maintained Packages</b></summary>

  Available via [pkgx](https://pkgx.sh/). Package script [here](https://github.com/pkgxdev/pantry/blob/main/projects/supabase.com/cli/package.yml).
  To install in your working directory:

  ```bash
  pkgx install supabase
  ```

  Available via [Nixpkgs](https://nixos.org/). Package script [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/supabase-cli/default.nix).
</details>

### Run the CLI

```bash
supabase bootstrap
```

Or using npx:

```bash
npx supabase bootstrap
```

The bootstrap command will guide you through the process of setting up a Supabase project using one of the [starter](https://github.com/supabase-community/supabase-samples/blob/main/samples.json) templates.

## Docs

Command & config reference can be found [here](https://supabase.com/docs/reference/cli/about).

## Breaking changes

We follow semantic versioning for changes that directly impact CLI commands, flags, and configurations.

However, due to dependencies on other service images, we cannot guarantee that schema migrations, seed.sql, and generated types will always work for the same CLI major version. If you need such guarantees, we encourage you to pin a specific version of CLI in package.json.

## Developing

To run from source:

```sh
# Go >= 1.22
go run . help
```
