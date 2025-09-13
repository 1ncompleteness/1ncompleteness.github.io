# 1ncompleteness.github.io - Modern Portfolio

## 🚀 Modern TypeScript Next.js Portfolio with Dark Theme

A cutting-edge portfolio website built with the latest web technologies, featuring an interactive 3D knowledge graph visualization.

### ✨ Features

- **Dark Theme Only**: Sleek, modern dark interface
- **Interactive 3D Knowledge Graph**: Three.js-powered visualization of skills and knowledge
- **TypeScript**: Full type safety and modern development experience
- **Next.js 14**: Latest framework features with app router
- **Tailwind CSS**: Utility-first styling with custom dark theme
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Perfect on all devices
- **Courses Section**: Comprehensive display of academic coursework
- **No Professor References**: Clean, professional presentation

### 🛠️ Tech Stack

- **Framework**: Next.js 14.1.0 with TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 11.0.3
- **3D Graphics**: Three.js with React Three Fiber
- **Graph Visualization**: React Force Graph 3D
- **Icons**: Lucide React

### 📁 Project Structure

```
1ncompleteness.github.io/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main landing page
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
│   └── KnowledgeGraph.tsx # 3D graph visualization
├── data.json             # Portfolio data (courses, skills, etc.)
├── index.html            # Static fallback version
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── postcss.config.js     # PostCSS configuration
```

### 🚀 Quick Start (Static Version)

The repository includes a static `index.html` that works without any build tools:

1. Open `index.html` in your browser
2. Full functionality including 3D graph visualization

### 💻 Development Setup (When npm is available)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

### 📊 Data Structure

The `data.json` file contains all portfolio information:

- **Personal**: Name, title, philosophy, social links
- **Education**: Degrees, majors, minors
- **Courses Taken**: Computer Science, Mathematics, Interdisciplinary
- **Research**: Active projects and publications
- **Entrepreneurship**: Company details (Entelligent)
- **Technical Skills**: Languages, frameworks, databases
- **Academic Service**: Tutoring and interests

### 🎨 Customization

#### Update Personal Information
Edit `data.json` to modify:
- Personal details
- Course listings
- Research projects
- Skills and technologies

#### Modify Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#3b82f6',    // Blue
  secondary: '#8b5cf6',  // Purple
  accent: '#06b6d4',     // Cyan
}
```

### 🌐 Deployment

#### GitHub Pages (Static)
1. Push to main branch
2. Enable GitHub Pages in repository settings
3. Site available at: https://1ncompleteness.github.io

#### Vercel/Netlify (Next.js)
1. Connect repository
2. Deploy automatically on push
3. No configuration needed

### 📝 Key Changes from Previous Version

1. **Removed**: "Currently enrolled in Professor Huang's COMP 542 course"
2. **Added**: Comprehensive courses section with all coursework
3. **Updated**: Modern TypeScript/Next.js architecture
4. **Enhanced**: 3D graph visualization with Three.js
5. **Simplified**: Dark theme only for consistency
6. **Optimized**: Latest npm dependencies

### 🔧 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 📄 License

© 2025 Behrouz Barati B. All rights reserved.

### 🤝 Contact

- **Email**: behrouz@entelligent.ai
- **GitHub**: [@1ncompleteness](https://github.com/1ncompleteness)
- **LinkedIn**: [behrouz-barati](https://www.linkedin.com/in/behrouz-barati/)

---

*Built with passion for AI/ML research and modern web technologies.*