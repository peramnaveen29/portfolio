// ===== NAVIGATION =====
function initNav() {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navmenu = document.querySelector('.navmenu');
  const navLinks = document.querySelectorAll('.navmenu a');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navmenu a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    const btn = document.getElementById('scrollTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    const open = navmenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId.startsWith('#')) return;
      e.preventDefault();
      
      const target = document.querySelector(targetId);
      if (!target) return;

      // Close mobile nav
      navmenu.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      // Section Switch Animation
      document.body.classList.add('section-switching');
      
      setTimeout(() => {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'instant' });
        
        setTimeout(() => {
          document.body.classList.remove('section-switching');
        }, 50);
      }, 350);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navmenu.classList.contains('open')) {
      navmenu.classList.remove('open');
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ===== ROLE TICKER =====
function initRoleTicker() {
  const roles = document.querySelectorAll('.role');
  if (!roles.length) return;
  let current = 0;

  function next() {
    roles[current].classList.remove('active');
    roles[current].classList.add('exit');
    const prev = current;
    setTimeout(() => roles[prev].classList.remove('exit'), 400);
    current = (current + 1) % roles.length;
    roles[current].classList.add('active');
  }

  setInterval(next, 2800);
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const nums = document.querySelectorAll('.num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let startTime = null;
      const duration = 1800;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== SKILLS =====
async function loadSkills() {
  try {
    const res = await fetch('data/skills.json');
    if (!res.ok) throw new Error('Failed to load skills');
    const data = await res.json();
    renderSkills(data.skills);
  } catch {
    renderSkills(getInlineSkills());
  }
}

function renderSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  grid.innerHTML = skills.map(cat => `
    <div class="skill-category">
      <h3>${cat.category}</h3>
      <div class="skill-icons">
        ${cat.items.map(item => `
          <div class="skill-item">
            ${item.img 
              ? `<img src="/portfolio/${item.img}" alt="${item.name}" class="skill-img-icon" aria-hidden="true" onerror="this.src='https://api.iconify.design/vscode-icons:default-custom.svg'">`
              : (item.devicon 
                ? `<i class="${item.devicon}" aria-hidden="true"></i>` 
                : `<span>${item.icon || '📌'}</span>`)
            }
            <span>${item.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  initReveal();
}

// ===== PROJECTS =====
let allProjects = [];

async function loadProjects() {
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    allProjects = data.projects;
    renderProjects('all');
  } catch {
    // Fallback to inline data
    allProjects = getInlineProjects();
    renderProjects('all');
  }
}

function renderProjects(filter) {
  const grid = document.getElementById('projectGrid');
  const noResults = document.querySelector('.no-results');
  if (!grid) return;

  const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter);

  if (!filtered.length) {
    grid.innerHTML = '';
    if (noResults) noResults.hidden = false;
    return;
  }
  if (noResults) noResults.hidden = true;

  grid.innerHTML = filtered.map(p => `
    <article class="project-card reveal" tabindex="0" role="button"
      aria-label="View details for ${p.title}" data-id="${p.id}">
      <div class="project-thumb">
        ${p.img 
          ? `<img src="${p.img}" alt="${p.title}" class="project-thumb-img" aria-hidden="true">`
          : `<div class="project-thumb-placeholder" aria-hidden="true">${p.emoji}</div>`
        }
        <div class="project-overlay">
          <div class="project-overlay-title">${p.title}</div>
          <div class="project-overlay-tech">${p.technologies.slice(0,3).join(' · ')}</div>
        </div>
      </div>
      <div class="project-info">
        <div class="project-meta">
          <span class="project-company">${p.company}</span>
          <span class="project-cat">${p.category.toUpperCase()}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.shortDesc}</p>
        <div class="project-tags">
          ${p.technologies.slice(0,4).map(t => `<span class="project-tag">${t}</span>`).join('')}
          ${p.technologies.length > 4 ? `<span class="project-tag">+${p.technologies.length - 4}</span>` : ''}
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    const open = () => openModal(allProjects.find(p => p.id === card.dataset.id));
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  // Re-run reveal for new cards
  initReveal();
}

function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

// ===== MODAL =====
let lastFocused = null;

function openModal(project) {
  if (!project) return;
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  lastFocused = document.activeElement;

  body.innerHTML = `
    <h2 id="modalTitle">${project.title}</h2>
    <p class="modal-company">${project.role} · ${project.company}</p>
    <div class="modal-tech-tags">
      ${project.technologies.map(t => `<span class="modal-tech-tag">${t}</span>`).join('')}
    </div>
    <div class="modal-section">
      <h3>Overview</h3>
      <p>${project.description}</p>
    </div>
    <div class="modal-section">
      <h3>Key Contributions</h3>
      <ul>${project.contributions.map(c => `<li>${c}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <h3>Results & Impact</h3>
      <ul>${project.results.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    </div>
  `;

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const focusable = modal.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }, 50);
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function initModal() {
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    const modal = document.getElementById('projectModal');
    if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') closeModal();
  });

  document.getElementById('projectModal')?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const modal = document.getElementById('projectModal');
    const focusable = [...modal.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

// ===== FOOTER =====
function initFooter() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ===== SCROLL TO TOP =====
function initScrollTop() {
  document.getElementById('scrollTop')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== CERTIFICATIONS STRIP =====
function initCertStrip() {
  const strip = document.getElementById('certStrip');
  if (!strip) return;
  const certs = [
    'AWS Certified DevOps Engineer – Professional',
    'AWS Certified Solutions Architect – Associate',
    'AWS Certified SysOps Administrator – Associate',
    'Certified Jenkins Engineer (CJE)',
    'CyberArk Certified Trustee'
  ];
  const html = certs.map(c => `<span class="cert-item">🏆 ${c}</span>`).join('');
  strip.innerHTML = html + html; // duplicate for seamless loop
}

// ===== INLINE FALLBACK DATA =====
function getInlineProjects() {
  return [
    {
      id: 'p1', title: 'Global AWS Multi-Account Landing Zone',
      shortDesc: 'Hub-and-spoke multi-account AWS ecosystem supporting 100+ data engineers across 3 regions.',
      description: 'Architected a decoupled, multi-account AWS ecosystem using Terraform Enterprise at First Citizens Bank.',
      technologies: ['AWS', 'Terraform', 'Sentinel', 'Transit Gateway', 'IAM', 'GitLab CI/CD'],
      category: 'cloud', emoji: '🏗️', role: 'Lead Cloud Infrastructure DevOps & SRE Engineer',
      company: 'First Citizens Bank',
      contributions: ['Designed Hub-and-Spoke multi-account topology via Transit Gateway', 'Integrated HashiCorp Sentinel for Policy-as-Code guardrails', 'Managed state refactoring across 50+ workspaces with zero drift'],
      results: ['Supported 100+ data engineers on mission-critical ML workloads', 'Standardized infrastructure across 3 AWS regions', 'Zero infrastructure drift across 50+ workspaces'],
      featured: true, repository: 'https://github.com/peramnaveen29'
    },
    {
      id: 'p2', title: 'GenAI Developer Portal & RAG Platform',
      shortDesc: 'Internal PaaS using Amazon Bedrock eliminating 30+ manual SRE requests per month.',
      description: 'Designed an internal PaaS using Amazon Bedrock and AWS Service Catalog for LLM-driven self-service provisioning.',
      technologies: ['Amazon Bedrock', 'LangChain', 'OpenSearch', 'SageMaker', 'Python'],
      category: 'genai', emoji: '🤖', role: 'Lead Cloud Infrastructure DevOps & SRE Engineer',
      company: 'First Citizens Bank',
      contributions: ['Built RAG-based knowledge assistants with OpenSearch vector stores', 'Engineered LangChain orchestration across 3 business units'],
      results: ['Eliminated 30+ manual SRE requests per month', 'Enabled developer self-service for 100+ engineers'],
      featured: true, repository: 'https://github.com/peramnaveen29'
    },
    {
      id: 'p3', title: 'Event-Driven ETL & FinOps Architecture',
      shortDesc: 'Ephemeral PySpark compute cutting idle costs by 35%, saving $200K+ annually.',
      description: 'Engineered ephemeral self-terminating PySpark compute using S3 Events → Lambda → dynamic EC2.',
      technologies: ['AWS Lambda', 'S3', 'EC2', 'PySpark', 'Step Functions', 'Python'],
      category: 'devops', emoji: '💰', role: 'Lead Cloud Infrastructure DevOps & SRE Engineer',
      company: 'First Citizens Bank',
      contributions: ['Engineered ephemeral self-terminating PySpark compute', 'Deployed AWS Instance Scheduler for EC2/RDS lifecycle automation'],
      results: ['Cut idle compute costs by ~35%', 'Estimated $200K+ annual savings'],
      featured: true, repository: 'https://github.com/peramnaveen29'
    },
    {
      id: 'p4', title: 'Serverless DataOps & MLOps Pipeline',
      shortDesc: 'Multi-modal ingestion pipeline (SQS → Lambda → Glue → SageMaker) at Silicon Valley Bank.',
      description: 'Architected multi-modal ingestion pipeline with Step Functions orchestration and Lake Formation governance.',
      technologies: ['AWS Lambda', 'SQS', 'AWS Glue', 'SageMaker', 'Step Functions', 'Snowflake'],
      category: 'cloud', emoji: '🧠', role: 'Senior Software Engineer – DevOps',
      company: 'Silicon Valley Bank',
      contributions: ['Architected SQS → Lambda → Glue → SageMaker pipeline', 'Implemented Lake Formation for fine-grained data lake governance'],
      results: ['Reduced deployment errors by ~60%', 'Scaled DevOps team from 1 to 10 engineers'],
      featured: true, repository: 'https://github.com/peramnaveen29'
    },
    {
      id: 'p5', title: 'Cross-Region Disaster Recovery Platform',
      shortDesc: 'Automated cross-region DR achieving <15-minute RTO for mission-critical workloads.',
      description: 'Architected cross-region DR strategies automating failover of mission-critical data workloads.',
      technologies: ['AWS', 'Route53', 'RDS', 'Terraform', 'Python', 'Step Functions'],
      category: 'sre', emoji: '🛡️', role: 'Lead Cloud Infrastructure DevOps & SRE Engineer',
      company: 'First Citizens Bank',
      contributions: ['Automated TFE state replication to secondary AWS regions', 'Developed self-healing workflows for cross-account data replication'],
      results: ['Achieved <15-minute RTO for core platform services', 'Zero-downtime DR validation'],
      featured: false, repository: 'https://github.com/peramnaveen29'
    },
    {
      id: 'p6', title: 'Enterprise Security & WAF Governance',
      shortDesc: 'Enterprise-wide edge security with AWS WAF, Prisma Cloud CSPM, and PGP encryption gateway.',
      description: 'Engineered enterprise-wide edge security with AWS WAF, Prisma Cloud CSPM, and SFTP PGP encryption.',
      technologies: ['AWS WAF', 'Prisma Cloud', 'AWS Transfer Family', 'Lambda', 'KMS', 'IAM'],
      category: 'sre', emoji: '🔐', role: 'Lead Cloud Infrastructure DevOps & SRE Engineer',
      company: 'First Citizens Bank',
      contributions: ['Deployed AWS WAF with OWASP Top 10 protection', 'Implemented Prisma Cloud CSPM for drift detection'],
      results: ['Enterprise-wide OWASP Top 10 protection', 'Continuous compliance monitoring with automated remediation'],
      featured: false, repository: 'https://github.com/peramnaveen29'
    }
  ];
}

function getInlineSkills() {
  return [
    {
      "category": "Cloud Platforms & Core AWS",
      "items": [
        { "name": "AWS", "devicon": "devicon-amazonwebservices-plain-wordmark colored" },
        { "name": "EKS", "icon": "⎈" },
        { "name": "ECS / Fargate", "icon": "📦" },
        { "name": "Lambda", "icon": "λ" },
        { "name": "EC2 / S3", "devicon": "devicon-amazonwebservices-plain colored" }
      ]
    },
    {
      "category": "CI/CD & DevOps",
      "items": [
        { "name": "GitLab CI", "devicon": "devicon-gitlab-plain colored" },
        { "name": "Jenkins", "devicon": "devicon-jenkins-plain colored" },
        { "name": "GitHub Actions", "devicon": "devicon-githubactions-plain colored" },
        { "name": "Azure DevOps", "devicon": "devicon-azuredevops-plain colored" }
      ]
    }
  ];
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initRoleTicker();
  initCounters();
  initReveal();
  loadSkills();
  loadProjects();
  initFilters();
  initModal();
  initFooter();
  initScrollTop();
  initCertStrip();
});
