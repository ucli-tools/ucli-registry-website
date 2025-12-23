# UCLI Tools Registry Website

The official web interface for discovering and installing UCLI Tools. Built with Astro and deployed to GitHub Pages.

## 🌐 Live Website

Visit [registry.ucli.tools](https://registry.ucli.tools) to browse available tools.

## 🚀 Features

- **Dynamic Tool Discovery**: Real-time loading of tools from the UCLI Registry
- **Search & Filter**: Find tools by name, description, tags, or status
- **Copy Install Commands**: One-click copying of `ucli build <tool>` commands
- **Responsive Design**: Works beautifully on desktop and mobile
- **Fast & Lightweight**: Static site with excellent performance

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build/) - Modern web framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Icons**: Heroicons (via custom SVG)
- **API**: Astro API routes for dynamic data
- **Deployment**: GitHub Pages with automated CI/CD

## 📁 Project Structure

```
ucli-registry-website/
├── public/                          # Static assets
│   └── CNAME                       # Custom domain configuration
├── src/
│   ├── pages/                      # Astro pages and API routes
│   │   ├── index.astro            # Main registry page
│   │   └── api/
│   │       └── apps.json.ts       # API endpoint for tool data
│   └── layouts/                   # Page layouts (if any)
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions deployment
├── astro.config.mjs               # Astro configuration
├── tailwind.config.mjs            # Tailwind configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🏃‍♂️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ucli-tools/ucli-registry-website.git
   cd ucli-registry-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:4321`

The development server supports hot reloading - changes will be reflected immediately.

### Build for Production

```bash
npm run build
```

This creates a `dist/` directory with the production build.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## 🚀 Deployment

### Automatic Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch via the `.github/workflows/deploy.yml` workflow.

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to GitHub Pages (requires gh CLI)
npm run deploy
```

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The site fetches data directly from the UCLI Registry GitHub repository.

### Custom Domain

The site is configured to deploy to `registry.ucli.tools` via the `public/CNAME` file.

## 📊 Data Source

The website fetches tool data from the [UCLI Registry](https://github.com/ucli-tools/ucli-registry) repository:

- **Registry URL**: `https://raw.githubusercontent.com/ucli-tools/ucli-registry/main/registry/apps.yaml`
- **API Endpoint**: `/api/apps.json` (local Astro route that fetches and parses the registry)
- **Cache**: 1-hour caching for performance

## 🎨 Customization

### Styling

The site uses Tailwind CSS with custom orange theme colors. Key colors:

- Primary: `#ea580c` (Orange)
- Background gradients: Orange to red spectrum
- Accent: Yellow (`#fbbf24`)

### Adding New Features

- **API Routes**: Add new endpoints in `src/pages/api/`
- **Pages**: Create new pages in `src/pages/`
- **Components**: Use Astro components for reusable UI elements

## 🤝 Contributing

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test locally: `npm run dev`
5. Commit and push your changes
6. Submit a pull request

### Content Updates

Tool data is managed in the [ucli-registry](https://github.com/ucli-tools/ucli-registry) repository. Updates to tool listings, descriptions, or metadata should be made there.

### Design Improvements

- Ensure responsive design works on all screen sizes
- Maintain the orange/yellow color scheme
- Keep the interface clean and professional

## 📈 Performance

- **Lighthouse Score**: Targets 90+ on all metrics
- **Bundle Size**: Optimized with Astro's built-in optimizations
- **Loading Speed**: Fast initial page loads with minimal JavaScript
- **SEO**: Proper meta tags and structured data

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API not loading:**
- Check that the UCLI Registry repository is accessible
- Verify the YAML format in the registry
- Check browser console for network errors

**Styling issues:**
```bash
# Rebuild CSS
npm run build
```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/ucli-tools/ucli-registry-website/issues)
- **Discussions**: [Community Forum](https://github.com/ucli-tools/community/discussions)
- **Documentation**: [docs.ucli.tools](https://docs.ucli.tools)

## 📄 License

Licensed under the Apache License 2.0. See [LICENSE](../LICENSE) for details.

---

**Ready to contribute?** Check out our [Contributing Guide](https://docs.ucli.tools/community/contributing) or start by running `npm run dev` locally!
