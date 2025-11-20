# 🌙 Moon Phase Viewer

> 月の満ち欠けを美しく表示し、AIで生成された情報を提供するPWAアプリケーション

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange)](https://web.dev/progressive-web-apps/)

## ✨ Features

- 🌑🌒🌓🌔🌕 **Realistic Moon Phases** - Physics-based spherical shadow masking with limb darkening
- 📅 **200 Year Range** - Calculate moon phases from 1925 to 2125
- 🤖 **AI-Generated Content** - Moon trivia, fortune messages, and observation tips using Gemini 2.5 Flash
- 💾 **Offline First** - Moon calculations work offline (PWA)
- 🎨 **Beautiful Dark UI** - Night sky-themed interface with smooth animations
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/takamiya1021/app031-moon-phase.git
cd app031-moon-phase

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🔑 API Key Setup (Optional)

To use AI-generated content, you'll need a Google AI Studio API key:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "⚙️ Settings" in the app
3. Enter your API key

> **Note**: The app works without an API key but will display dummy data for AI features.

## 📸 Screenshots

<!-- Add screenshots here -->

## �️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **AI**: [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash)
- **PWA**: [next-pwa](https://github.com/shadowwalker/next-pwa)
- **Testing**: [Jest](https://jestjs.io/) + [Playwright](https://playwright.dev/)

## 🌙 Moon Phase Calculation

### Algorithm

- **Reference Date**: January 6, 2000, 18:14 UTC (Known New Moon)
- **Synodic Period**: 29.53058867 days
- **Supported Range**: 1925–2125 (±100 years)

### Moon Phase Names

新月 (New Moon) → 三日月 (Crescent) → 上弦 (First Quarter) → 十三夜 (Waxing Gibbous) → 満月 (Full Moon) → 寝待月 (Waning Gibbous) → 下弦 (Last Quarter) → 有明月 (Waning Crescent)

## 🎨 Visual Features

### Canvas Rendering

- **2D Canvas** - Pixel-perfect control for realistic rendering
- **Spherical Shadow Masking** - Physically accurate shadow calculation
- **Limb Darkening** - Natural edge darkening effect
- **Adjustable Terminator** - Sharp yet smooth shadow boundary
- **Color Grading** - Bluish-white lunar tint (R: 0.85, G: 0.95, B: 1.2)

### Performance

- 60fps smooth animations
- Responsive canvas sizing
- Optimized pixel operations with `willReadFrequently` flag

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

**Test Coverage**:
- ✅ Moon age calculation (21 tests)
- ✅ Canvas rendering (10 tests)
- ✅ UI components (21 tests)
- ✅ AI service (8 tests)
- ✅ E2E scenarios (4 tests)

## 📁 Project Structure

```
app031-moon-phase/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main page
│   ├── layout.tsx           # Root layout
│   └── settings/            # Settings page
├── components/              # React components
│   ├── MoonCanvas.tsx       # Moon rendering with Canvas 2D
│   ├── DateSelector.tsx     # Date picker
│   ├── MoonInfo.tsx         # Moon phase info display
│   ├── GenerateButton.tsx   # AI generation button
│   └── AIContentSection.tsx # AI content display
├── lib/                     # Utilities
│   ├── moonPhase.ts        # Moon age calculation
│   ├── aiService.ts        # Gemini API integration
│   └── storage.ts          # localStorage management
├── hooks/                   # Custom React hooks
├── e2e/                     # Playwright E2E tests
└── __tests__/              # Jest unit tests
```

## 🔧 Configuration

### Environment Variables

> **Important**: This app does NOT use `.env` files. API keys are managed through the in-app settings page and stored in localStorage.

### PWA Manifest

Located in `public/manifest.json`. Customize app name, icons, and theme colors as needed.

## � Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import project in Vercel
3. Deploy (no environment variables needed)

### Other Platforms

Works on any platform supporting Next.js 14:
- Netlify
- Cloudflare Pages  
- AWS Amplify

## 📚 Documentation

- [要件定義書](doc/requirements.md) - Requirements Specification
- [技術設計書](doc/technical-design.md) - Technical Design
- [実装計画書](doc/implementation-plan.md) - Implementation Plan

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## � Acknowledgments

- Moon texture from NASA
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built with [Next.js](https://nextjs.org/)

## 📞 Contact

- GitHub: [@takamiya1021](https://github.com/takamiya1021)
- Project Link: [https://github.com/takamiya1021/app031-moon-phase](https://github.com/takamiya1021/app031-moon-phase)

---

**Made with 🌙 and ✨**
