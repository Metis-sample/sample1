/**
 * Style A floral studio - Optimized JavaScript
 * Clean, efficient script with modern practices
 */

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// DOM elements cache
const elements = {};

// Initialize DOM elements cache
const initializeElements = () => {
    elements.body = document.body;
    elements.header = document.querySelector('.header');
    elements.progressBar = document.querySelector('.progress-bar');
    elements.hamburger = document.querySelector('.hamburger');
    elements.navMenu = document.querySelector('.nav-menu');
    elements.ctaButton = document.querySelector('.cta-button');
    elements.scrollToTopBtn = document.getElementById('scrollToTop');
    elements.heroTitle = document.querySelector('.hero-title');
    elements.servicesHero = document.querySelector('.services-hero');
    elements.servicesHeroTitle = document.querySelector('.services-hero h1');
};

// Mobile Navigation Controller
class MobileNav {
    constructor() {
        this.hamburger = elements.hamburger;
        this.navMenu = elements.navMenu;
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;
        
        this.hamburger.addEventListener('click', () => this.toggle());
        this.setupMenuItemListeners();
    }

    toggle() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            elements.body.style.overflow = 'hidden';
        } else {
            elements.body.style.overflow = '';
        }
    }

    setupMenuItemListeners() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    close() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        elements.body.style.overflow = '';
    }
}

// Scroll Effects Controller
class ScrollEffects {
    constructor() {
        this.lastScrollTop = 0;
        this.init();
    }

    init() {
        if (!elements.header || !elements.progressBar) return;
        
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        this.updateHeader(scrollTop);
        this.updateProgressBar(scrollTop, docHeight);
        
        this.lastScrollTop = scrollTop;
    }

    updateHeader(scrollTop) {
        // Hide/show header on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            elements.header.style.transform = 'translateY(-100%)';
        } else {
            elements.header.style.transform = 'translateY(0)';
        }

        // Update header background
        if (scrollTop > 50) {
            elements.header.style.background = 'rgba(255, 255, 255, 0.98)';
            elements.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            elements.header.style.background = 'rgba(255, 255, 255, 0.95)';
            elements.header.style.boxShadow = 'none';
        }
    }

    updateProgressBar(scrollTop, docHeight) {
        if (docHeight <= 0) return;
        
        const progress = (scrollTop / docHeight) * 100;
        elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// Intersection Observer for animations
class AnimationController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, options);
    }

    observeElements() {
        const animateSelectors = [
            '.hero-content',
            '.section-title', 
            '.about-text', 
            '.about-image',
            '.services-image', 
            '.services-text',
            '.gallery-item',
            '.contact-info',
            '.contact-methods',
            '.services-hero',
            '.service-detail-text',
            '.service-detail-image',
            '.contact-cta-section',
            '.contact-cta-title',
            '.contact-cta-subtitle',
            '.contact-card'
        ];

        animateSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => this.observer.observe(el));
        });
    }
}

// Smooth Scroll Controller
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupActiveNavHighlighting();
    }

    setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    const headerHeight = elements.header?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveNavHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const updateActiveNav = throttle(() => {
            const scrollTop = window.pageYOffset;
            const headerHeight = elements.header?.offsetHeight || 0;
            
            let activeSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                    activeSection = sectionId;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + activeSection) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', updateActiveNav);
    }
}

// Gallery Lightbox Controller
class GalleryLightbox {
    constructor() {
        this.init();
    }

    init() {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        galleryItems.forEach(img => {
            img.addEventListener('click', () => this.createLightbox(img.src, img.alt));
            img.style.cursor = 'pointer';
        });
    }

    createLightbox(src, alt) {
        const lightbox = this.createLightboxElement();
        const { content, img, closeBtn } = this.createLightboxContent(src, alt);
        
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
        });
        
        // Setup close handlers
        this.setupCloseHandlers(lightbox, closeBtn);
    }

    createLightboxElement() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
        `;
        return lightbox;
    }

    createLightboxContent(src, alt) {
        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            cursor: default;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 10px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', '画像を閉じる');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: -40px;
            color: white;
            font-size: 30px;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        });

        content.appendChild(img);
        content.appendChild(closeBtn);

        return { content, img, closeBtn };
    }

    setupCloseHandlers(lightbox, closeBtn) {
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            document.body.style.overflow = '';
            setTimeout(() => {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
            }, 300);
            document.removeEventListener('keydown', handleEscape);
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        closeBtn.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', handleEscape);
    }
}

// Button Effects Controller
class ButtonEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupCTAButton();
        this.setupContactButtons();
        this.setupContactCards();
    }

    setupCTAButton() {
        if (!elements.ctaButton) return;

        elements.ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const servicesSection = document.querySelector('#gallery');
            if (servicesSection) {
                const headerHeight = elements.header?.offsetHeight || 0;
                const targetPosition = servicesSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            }
            
            this.addClickEffect(elements.ctaButton);
        });
    }

    setupContactButtons() {
        const contactButtons = document.querySelectorAll('.contact-button');
        contactButtons.forEach(button => {
            button.addEventListener('click', () => this.addClickEffect(button));
        });
    }

    setupContactCards() {
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach(card => {
            card.addEventListener('click', () => this.addClickEffect(card, 'scale(0.98)'));
        });
    }

    addClickEffect(element, transform = 'scale(0.95)') {
        const originalTransform = element.style.transform;
        element.style.transform = transform;
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, 150);
    }
}

// Scroll to Top Controller
class ScrollToTop {
    constructor() {
        this.button = elements.scrollToTopBtn;
        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener('scroll', debounce(() => this.toggleVisibility(), 100));
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleVisibility() {
        const shouldShow = window.pageYOffset > 500;
        this.button.classList.toggle('visible', shouldShow);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Text Animation Controller
class TextAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.animateHeroTitle();
        this.animateServicesHeroTitle();
    }

    animateHeroTitle() {
        if (!elements.heroTitle) return;

        const words = elements.heroTitle.textContent.split(' ');
        elements.heroTitle.innerHTML = words.map(word => 
            `<span style="opacity: 0; transform: translateY(20px); display: inline-block; transition: all 0.6s ease;">${word}</span>`
        ).join(' ');

        const spans = elements.heroTitle.querySelectorAll('span');
        
        setTimeout(() => {
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 500);
    }

    animateServicesHeroTitle() {
        if (!elements.servicesHeroTitle) return;

        const words = elements.servicesHeroTitle.textContent.split(' ');
        elements.servicesHeroTitle.innerHTML = words.map((word, index) => 
            `<span style="opacity: 0; transform: translateY(20px); display: inline-block; transition: all 0.6s ease; transition-delay: ${0.5 + index * 0.2}s;">${word}</span>`
        ).join(' ');

        setTimeout(() => {
            const spans = elements.servicesHeroTitle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 600);

        // Animate services hero section
        if (elements.servicesHero) {
            setTimeout(() => {
                elements.servicesHero.classList.add('loaded');
            }, 300);
        }
    }
}

// Main App Controller
class App {
    constructor() {
        this.controllers = [];
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        initializeElements();
        this.initializeControllers();
        this.setupPageLoadEffect();
    }

    initializeControllers() {
        this.controllers = [
            new MobileNav(),
            new ScrollEffects(),
            new AnimationController(),
            new SmoothScroll(),
            new GalleryLightbox(),
            new ButtonEffects(),
            new ScrollToTop(),
            new TextAnimations()
        ];
    }

    setupPageLoadEffect() {
        // Add loaded class to body with delay
        setTimeout(() => {
            elements.body.classList.add('loaded');
        }, 100);

        // Performance optimization: Remove loading styles after animations
        setTimeout(() => {
            const loadingStyles = document.querySelector('style[data-loading]');
            if (loadingStyles) {
                loadingStyles.remove();
            }
        }, 2000);
    }
}

// Initialize the application
new App();