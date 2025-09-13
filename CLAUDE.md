# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- **Run development server**: `npm run dev` - Starts Next.js development server on http://localhost:3000
- **Build for production**: `npm run build` - Creates optimized production build
- **Start production server**: `npm start` - Runs production build locally
- **Lint code**: `npm run lint` - Runs ESLint to check code quality
- **Type check**: `npm run type-check` - Runs TypeScript compiler without emitting files to verify types

### Testing
- **Test website structure**: `python3 test_website.py` - Verifies file structure, data.json content, and HTML sections
- **Test HTML static version**: `python3 test_html.py` - Tests the static index.html fallback
- **Test updates**: `python3 test_updates.py` - Validates recent changes and configurations
- **Verify build**: `./verify_build.sh` - Quick verification of Next.js 15 & React 19 configuration

### Deployment
- **Deploy to GitHub Pages**: `./deploy.sh` - Interactive script to commit and push changes to GitHub Pages

## Architecture

This is a modern portfolio website with dual deployment options:

1. **Static Version** (`index.html`): Standalone file that works without build tools, includes inline Three.js visualization
2. **Next.js Application**: Full React 19 application with server-side rendering capabilities

### Core Structure
- **Data-driven**: All portfolio content is centralized in `data.json`, making updates simple without touching code
- **Component Architecture**: 
  - `app/page.tsx`: Main landing page with sections (Hero, About, Research, Skills, Tree, Contact)
  - `components/TreeVisualization.tsx`: Interactive expanding tree view of the data structure
- **Styling**: Tailwind CSS with custom dark theme configuration, no light mode
- **Animation**: Framer Motion for smooth transitions and scroll-triggered animations

### Key Design Decisions
- **Single data source**: `data.json` drives both static HTML and React versions for consistency
- **Dark theme only**: Simplified theming system focused on a modern dark aesthetic
- **Tree visualization**: Replaced 3D graph with expandable tree that shows data hierarchy
- **TypeScript strict mode**: Full type safety enabled for better development experience
- **Latest dependencies**: Next.js 15.1.8, React 19.0.0 for cutting-edge features