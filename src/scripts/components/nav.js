// Navigation Component
// Implements: sticky header, scroll spy, hamburger menu toggle

class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navmenu = document.querySelector('.navmenu');
    this.hamburger = document.querySelector('.hamburger');
    this.navLinks = this.navmenu.querySelectorAll('a');
    this.sections = document.querySelectorAll('main section');
    this.scrollThreshold = 50;
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    // Create scroll spy observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.updateActiveLink(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all sections
    this.sections.forEach((section) => {
      this.observer.observe(section);
    });

    // Scroll event for header styling
    window.addEventListener('scroll', () => this.handleScroll());

    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu on link click (mobile)
    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.closeMenu();
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  handleScroll() {
    // Header styling on scroll
    if (window.scrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  updateActiveLink(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach((link) => {
      link.classList.remove('active');
    });

    // Add active class to current section link
    const activeLink = this.navLinks.find(
      (link) => link.getAttribute('href') === `#${sectionId}`
    );

    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.navmenu.classList.add('open');
      this.hamburger.classList.add('active');
      this.hamburger.setAttribute('aria-expanded', 'true');
      // Trap focus in menu
      this.trapFocus(this.navmenu);
    } else {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.navmenu.classList.remove('open');
    this.hamburger.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
  }

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeydown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeydown);

    // Remove listener when menu closes
    const closeListener = () => {
      element.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('menuClosed', closeListener);
    };

    document.addEventListener('menuClosed', closeListener);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }
  }
}

// Initialize navigation when DOM is ready
let navigationInstance = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    navigationInstance = new Navigation();
  });
} else {
  navigationInstance = new Navigation();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
