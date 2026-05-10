# Local Development Guide

This document is for internal reference for setting up the development environment for the Naveen Peram Portfolio.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the project root (this file is gitignored and will never be committed):
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   > **Note**: Without `.env.local`, the site still works — the visitor counter will silently hide itself.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure

- `public/data/`: JSON files containing resume content, skills, and projects.
- `src/styles/`: Modular CSS components.
- `src/scripts/`: Dynamic rendering logic and UI interactions.
- `src/scripts/components/`: Modular JS components (visitor counter, etc.).
- `public/icons/`: Locally hosted SVG assets for performance and reliability.
- `.env.local`: Local Firebase credentials (gitignored — never committed).
- `.github/workflows/deploy.yml`: CI/CD pipeline with secret injection.

## 📄 Updating Content

To update the portfolio content, modify the JSON files in `public/data/`:
- `skills.json`: Add or update technical skills and icons.
- `projects.json`: Add new featured projects and contributions.
- `contact.json`: Update social links and contact info.

## 📧 Contact Form (Formspree)

The contact form uses [Formspree](https://formspree.io/) for serverless email handling.
- **Endpoint**: The current endpoint is `https://formspree.io/f/mvzlvrlw`.
- **Updating**: To use your own form, change the `action` attribute in the `#contactForm` element within `index.html`.
- **Fallback**: The form logic in `main.js` (`initContactForm`) handles success and error states (including quota exhaustion).

## 🔐 Secrets & Environment Variables

### Local Development
Firebase credentials are read from `.env.local` via Vite's built-in env variable support. All variables must be prefixed with `VITE_` to be exposed to client-side code.

### Production (GitHub Pages)
The same variables are stored as **GitHub Actions Secrets** and injected during the build step in `deploy.yml`:
```yaml
- name: Build project
  run: npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    # ... (all 7 VITE_FIREBASE_* secrets)
```

### Required GitHub Secrets
| Secret Name | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

## 🌐 Deployment (GitHub Pages)

The project is configured for deployment via GitHub Actions.
1. Push changes to the `main` branch.
2. The `.github/workflows/deploy.yml` will automatically build and deploy to GitHub Pages.
3. Firebase credentials are injected from GitHub Secrets at build time — no manual configuration needed.
