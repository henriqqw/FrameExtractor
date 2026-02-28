# FrameXtractor

> **Free, private video frame extractor — runs entirely in your browser.**

Extract high-quality frames from any video as PNG or JPEG. No uploads, no server, no account. 100% client-side using the browser Canvas API.

🔗 **Live:** [framextractor.vercel.app](https://framextractor.vercel.app)
👤 **By:** [caosdev](https://caosdev.vercel.app)

---

## Features

- **Free forever** — no account, no payment, no limits
- **100% private** — files never leave your device
- **Fast extraction** — first frame or bulk by FPS / total count
- **Flexible output** — PNG (lossless) or JPEG (compact)
- **Custom resolution** — 4K, 1080p, 720p, or any custom width
- **Batch download** — single image or ZIP archive with all frames
- **Live preview** — see frames captured in real time during processing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Icons | [Lucide React](https://lucide.dev) |
| Frame processing | Browser Canvas API (client-side only) |
| ZIP export | JSZip + FileSaver.js |
| Deployment | [Vercel](https://vercel.com) |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main extraction tool |
| `/howto` | Step-by-step usage guide |
| `/about` | About the project |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Auto-generated robots file |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for [Vercel](https://vercel.com). Push to `main` to trigger automatic deployments.

```bash
# Optional: deploy via CLI
npx vercel --prod
```

## SEO

- Full `Metadata` API (Next.js App Router)
- Open Graph + Twitter Cards
- JSON-LD structured data (`SoftwareApplication`)
- Auto-generated `sitemap.xml` and `robots.txt`
- Canonical URLs on all pages

## Privacy

FrameXtractor processes video frames entirely in the **browser**:
- No files are uploaded to any server
- No analytics or tracking scripts
- No cookies or local storage used for data collection
- Works completely offline after first load

---

Built with ❤️ by [caosdev](https://caosdev.vercel.app)
