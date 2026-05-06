# Local Development Guide

This document is for internal reference for setting up the development environment for the Naveen Peram Portfolio.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure

- `public/data/`: JSON files containing resume content, skills, and projects.
- `src/styles/`: Modular CSS components.
- `src/scripts/`: Dynamic rendering logic and UI interactions.
- `public/icons/`: Locally hosted SVG assets for performance and reliability.

## 📄 Updating Content

To update the portfolio content, modify the JSON files in `public/data/`:
- `skills.json`: Add or update technical skills and icons.
- `projects.json`: Add new featured projects and contributions.
- `contact.json`: Update social links and contact info.

## 🌐 Deployment (GitHub Pages)

The project is configured for deployment via GitHub Actions.
1. Push changes to the `main` branch.
2. The `.github/workflows/deploy.yml` will automatically build and deploy to GitHub Pages.
