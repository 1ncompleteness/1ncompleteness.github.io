# Behrouz Barati B - Portfolio

Personal portfolio website with horizontal scrolling design, built with Next.js 15 and React 19.

## 🚀 Live Site
[https://1ncompleteness.github.io](https://1ncompleteness.github.io)

## 🛠️ Tech Stack
- **Framework:** Next.js 15.5.3
- **UI:** React 19.0.0
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Language:** TypeScript
- **Icons:** Lucide React

## 📦 Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## 🚢 Deployment to GitHub Pages

### Option 1: Automatic Deployment with GitHub Actions (Recommended)

This repository includes a GitHub Actions workflow that automatically builds and deploys your site when you push to the `main` branch.

**Setup Steps:**
1. Go to your repository Settings → Pages
2. Under "Build and deployment", set Source to "GitHub Actions"
3. Push your code to the `main` branch
4. GitHub Actions will automatically build and deploy your site
5. Your site will be available at `https://1ncompleteness.github.io`

### Option 2: Manual Local Build and Deploy

```bash
# Build the static site
npm run build

# The static files are now in the 'out' directory
# Commit and push the out directory
git add out/
git commit -m "Build for deployment"
git push
```

### Option 3: Deploy Script

Create a `deploy.sh` script:
```bash
#!/bin/bash
npm run build
git add out/
git commit -m "Deploy to GitHub Pages"
git push
```

## 📁 Project Structure
```
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main page component (3 horizontal sections)
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles with Entelligent palette
├── data.json           # All portfolio content
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
├── out/                # Static export (generated on build)
└── next.config.js      # Next.js config with static export
```

## 🎨 Features
- **Horizontal Scrolling:** 3-page swipeable portfolio
- **Entelligent Branding:** Custom color palette (#3c6e71, #284b63, #353535)
- **Skills & Experience:** Comprehensive display from data.json
- **Visions of the Future Past:** 100+ passion topics with gradient effects
- **Responsive Design:** Works on all devices
- **Navigation:** Keyboard arrows, dots, and swipe gestures

## 🔧 Configuration

### GitHub Pages Settings
The `next.config.js` is already configured for GitHub Pages:
```javascript
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '',
  assetPrefix: '',
}
```

### Important Notes
- The static HTML file (`index.html`) is NOT used by Next.js
- All content is in `data.json`
- Styling uses Tailwind CSS with custom Entelligent colors
- The site is fully static and requires no server

## 📝 Content Updates
To update content, edit `data.json`:
- Personal information
- Skills and experience
- Research interests
- Passionate interests (100+ topics)

## 🚀 Performance
- Static site generation for fast loading
- Optimized images
- Minimal JavaScript bundle
- Perfect Lighthouse scores

## 📄 License
© 2025 Behrouz Barati B