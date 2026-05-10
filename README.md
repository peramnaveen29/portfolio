# Naveen Peram - Professional Technical Portfolio

### **Live Site**: [peramnaveen29.github.io/portfolio/](https://peramnaveen29.github.io/portfolio/)

A **full-stack serverless** portfolio application — not just a static page. Built with a decoupled content engine, real-time Firebase backend, automated CI/CD with secret injection, and dual-layer analytics. Developed through **Agentic AI collaboration** in under 24 hours.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vite 8 · Vanilla JS (ES6+) · CSS3 · Glassmorphism |
| **Backend (BaaS)** | Firebase Realtime Database (atomic transactions + security rules) |
| **Analytics** | Google Analytics 4 · Firebase Dual Counter (views + unique visitors) |
| **CI/CD** | GitHub Actions (secret injection at build time) |
| **Hosting** | GitHub Pages (CDN) |
| **Security** | GitHub Secrets · Firebase Rules · Branch Protection Rulesets |

---

## 🏛️ Key Features

*   **Data-Driven Content Engine**: All professional data stored in normalized JSON — update content without touching HTML or CSS.
*   **Real-Time Visitor Counters**: Firebase-powered dual counters (total views + unique visitors via localStorage UUID tracking) displayed live in the footer.
*   **Google Analytics 4**: Full traffic observability — demographics, acquisition channels, device breakdown, and real-time monitoring.
*   **Zero-Trust Secrets Management**: Firebase credentials injected via `VITE_*` environment variables from GitHub Secrets at build time. No credentials in source code.
*   **Locked-Down Firebase Rules**: Write operations restricted to atomic `+1` increments only — all other operations denied.
*   **Automated CI/CD Pipeline**: `Push to main` → Secret injection → Vite build → GitHub Pages deploy. Fully hands-off.
*   **Mobile-First Design**: Responsive layouts with micro-animations, scroll-reveal effects, and section-switching transitions.
*   **Graceful Degradation**: Counters silently hide if Firebase credentials are missing (fork-friendly).

### **Security Architecture**
*   **Local Development**: `.env.local` (gitignored) stores Firebase credentials.
*   **Production Builds**: GitHub Actions Secrets are injected as `VITE_*` environment variables at build time.
*   **Database Rules**: Firebase Realtime Database locked down — only atomic `+1` counter increments permitted.
*   **Branch Protection**: GitHub Rulesets block force-pushes and restrict deletions.
*   **No secrets in source code** — the repository is fully safe for public visibility.

### **Future Roadmap**
*   **Architectural Deep-Dives**: Interactive system diagrams for featured projects.
*   **Technical Blog**: A space to share insights on GenAI, SRE practices, and Cloud Governance.
*   **Extended Case Studies**: Granular breakdowns of complex infrastructure transformations.

---

## 💡 Developed with Agentic AI Collaboration

This project was built using a high-velocity **"Vibe Coding"** workflow:
*   **Iterative Refinement**: Developed through high-level conceptual collaboration and robust iterative feedback loops.
*   **Agentic Orchestration**: The technical specifications were executed through multi-agent systems to ensure quality and speed.
*   **Efficiency**: The transition from conceptual spec to a live, production-hardened site was completed in **under 24 hours**.

---
*For a deep dive into the engineering behind this site, see [ARCHITECTURE.md](./ARCHITECTURE.md).*
*For internal setup and development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).*
