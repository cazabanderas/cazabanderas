# GitHub Pages Deployment Guide for Cazabanderas

This guide explains how to deploy the Cazabanderas website to GitHub Pages with proper SPA routing support.

## Prerequisites

- GitHub repository created and connected to this project
- Git installed locally
- Node.js and pnpm installed

## Setup Steps

### 1. Update `package.json` (if using a subdirectory)

If deploying to `https://username.github.io/cazabanderas/` (project repository), add the `homepage` field:

```json
{
  "homepage": "https://username.github.io/cazabanderas/",
  ...
}
```

If deploying to `https://username.github.io/` (user/org repository), no changes needed.

### 2. Build the Project

```bash
pnpm build
```

This generates the production build in the `dist/` directory, including:
- `index.html` (main entry point)
- `404.html` (SPA routing handler)
- All bundled assets

### 3. Deploy to GitHub Pages

#### Option A: Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.4.1
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

#### Option B: Manual Deployment

```bash
# Build the project
pnpm build

# Navigate to the dist/public directory
cd dist/public

# Initialize git in the dist folder (if not already done)
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push origin main:gh-pages --force
```

### 4. Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `gh-pages` (or `main` if using Option B differently)
   - **Folder**: Select `/ (root)`
4. Click **Save**

### 5. How It Works

The SPA routing is handled by two files:

- **`404.html`**: GitHub Pages serves this file for any non-existent routes. It stores the requested path in `sessionStorage` and redirects to `index.html`.
- **`main.tsx`**: On page load, it checks `sessionStorage` for the redirect path and uses `window.history.replaceState()` to restore the correct URL without a page reload.

This allows React Router (Wouter) to handle all routing client-side.

### 6. Verify Deployment

Once deployed:
1. Visit your GitHub Pages URL
2. Test navigation by clicking links (About, Team, Write-ups, etc.)
3. Refresh the page on different routes to confirm routing works
4. Check browser console for any errors

## Troubleshooting

**Issue**: Site shows 404 after deployment
- **Solution**: Ensure `404.html` is in the root of the deployed directory. Check GitHub Pages settings.

**Issue**: Styles or images not loading
- **Solution**: If using a project repository (not user/org), ensure the `homepage` field in `package.json` matches your GitHub Pages URL.

**Issue**: Routing doesn't work after refresh
- **Solution**: Verify that `404.html` is being served and that `main.tsx` contains the redirect handling code.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Deploying SPAs to GitHub Pages](https://github.com/rafgraph/spa-github-pages)
- [Wouter Router Documentation](https://github.com/molefrog/wouter)
