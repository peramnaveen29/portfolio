# Engineering the Professional Portfolio: A Case Study in SRE-Driven Web Architecture

### **Live Site**: [peramnaveen29.github.io/portfolio/](https://peramnaveen29.github.io/portfolio/)

This repository is not just a personal website; it is a demonstration of **modern platform engineering**, **automated CI/CD**, and **data-driven design** applied to a high-performance web asset.

---

## 🏛️ Architectural Rationale

As a **Lead Infrastructure SRE**, I believe that personal projects should reflect the same engineering standards as enterprise systems. This portfolio was built with a "Privacy-First, Performance-Always" mindset.

### **1. Data-Driven & Decoupled Content**
Instead of hardcoding content into HTML, the entire site is driven by a **JSON-based content engine**. This separation of concerns allows for:
*   **Rapid Updates**: Modifying professional experience or technical skills without touching the UI logic.
*   **Scalability**: The system is designed to support multiple "views" or versions by simply swapping data sources.

### **2. Automated CI/CD & Deployment Pipeline**
The site utilizes a robust **GitHub Actions** workflow (`deploy.yml`) to ensure:
*   **Zero-Downtime Updates**: Automated build and deployment to GitHub Pages on every push to the main branch.
*   **Build Optimization**: Leveraging Vite for asset bundling, tree-shaking, and minification to achieve high Lighthouse scores.

### **3. Enterprise Security & Governance**
To secure this public technical showcase, I have implemented:
*   **GitHub Repository Rulesets**: Enforcing strict branch protection, blocking force-pushes, and restricting deletions.
*   **Admin-Only Governance**: A tailored bypass list ensuring that while the site is public, control remains centralized and secure.

### **4. Modern UI Engineering**
*   **Performance**: Localized SVG hosting and optimized asset pathing for subpath deployment compatibility.
*   **Responsive Experience**: A custom CSS design system using glassmorphism and CSS variables for a premium, mobile-first experience.
*   **Accessibility**: Full ARIA-compliant navigation and semantic HTML structure.

---

## 🛠️ Tech Stack & Tooling

*   **Runtime/Build**: Node.js, Vite
*   **Styling**: Modern CSS3 (Variables, Grid, Flexbox)
*   **Logic**: Vanilla JavaScript (ES6+)
*   **Infrastructure**: GitHub Actions, GitHub Pages, Branch Rulesets
*   **Branding**: Professional SVG assets hosted locally for reliability.

---

## 💡 Developed with Agentic AI Collaboration
This project represents a collaboration between human architectural vision and **Agentic AI development**, utilizing high-fidelity spec-driven iteration to achieve production-grade results in record time.

---
*For internal setup and development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).*
