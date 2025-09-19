// ============================================
// PORTFOLIO WEBSITE JAVASCRIPT
// ============================================

// Global state
let activeSection = 'home';
let isMobileMenuOpen = false;
let mousePosition = { x: 0, y: 0 };

// ============================================
// THEME SWITCHER
// ============================================

function initializeTheme() {
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Check for saved theme in local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
        return;
    }

    // If no saved theme, check for user's OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

function applyTheme(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('dark-mode');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    initializeTheme(); // Initialize theme before other components
    // Single optimized scroll handler replaces individual listeners
    updateActiveSection();
    updateScrollProgress();
    handleScrollEffects();
    initializeIntersectionObserver();
    initializeNavigation();
    // Minimalist: no parallax/mouse tracking
});

// Initialize Lucide icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// NAVIGATION
// ============================================

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }

    // Close mobile menu if open
    if (isMobileMenuOpen) {
        toggleMobileMenu();
    }
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;

    const mobileMenu = document.querySelector('.nav-mobile');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (isMobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

// ============================================
// SCROLL PROGRESS
// ============================================

function initializeScrollProgress() { /* replaced by optimized handler */ }

function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    if (!scrollProgress) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = Math.min((window.scrollY / totalHeight) * 100, 100);
    
    scrollProgress.style.width = `${currentProgress}%`;
}

// ============================================
// ACTIVE SECTION TRACKING
// ============================================

function initializeActiveSection() { /* replaced by optimized handler */ }

function updateActiveSection() {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
    const viewportAnchor = 120; // approximate header/offset like reference

    let newActiveSection = sectionIds[0];
    for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top - viewportAnchor <= 0) {
            newActiveSection = sectionId;
        }
    }

    if (newActiveSection !== activeSection) {
        activeSection = newActiveSection;
        updateActiveNavigation();
    }
}

function updateActiveNavigation() {
    // Update desktop navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const section = item.getAttribute('data-section');
        if (section === activeSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update mobile navigation
    const mobileNavItems = document.querySelectorAll('.nav-item-mobile');
    mobileNavItems.forEach(item => {
        const section = item.getAttribute('data-section');
        if (section === activeSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-item, .nav-item-mobile, .logo-button, .scroll-indicator, .btn-primary, .btn-outline');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId) {
                scrollToSection(sectionId);
            }
        });
    });

    const mobileMenuButton = document.querySelector('.mobile-menu-btn');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initializeScrollEffects() { /* replaced by optimized handler */ }

function handleScrollEffects() {
    const header = document.querySelector('.header');
    const isScrolled = window.scrollY > 50;
    
    if (isScrolled) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ============================================
// MOUSE TRACKING FOR HERO ANIMATIONS
// ============================================

function initializeMouseTracking() {
    // disabled
}

function handleMouseMove(e) {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
    
    // disabled
}

function updateHeroWaves() {
    // disabled
}

// ============================================
// CONTACT FORM
// ============================================

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = `
        <i data-lucide="loader-2" class="animate-spin"></i>
        Sending...
    `;
    lucide.createIcons();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // In a real-world application, you would send this data to a backend service.
        // For example, using fetch() to POST to an API endpoint:
        //
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        // });
        // if (!response.ok) throw new Error('Network response was not ok.');
        
        console.log('Form submitted:', data);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

        showFormFeedback('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showFormFeedback('Sorry, something went wrong. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        lucide.createIcons();
    }
}

function showFormFeedback(message, type) {
    const feedbackElement = document.createElement('div');
    feedbackElement.textContent = message;
    feedbackElement.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'var(--azul-royal)' : '#b91c1c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 1rem;
        max-width: 320px;
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    document.body.appendChild(feedbackElement);

    // Animate in
    setTimeout(() => {
        feedbackElement.style.opacity = '1';
        feedbackElement.style.transform = 'translateX(0)';
    }, 10);

    // Animate out and remove after 5 seconds
    setTimeout(() => {
        feedbackElement.style.opacity = '0';
        feedbackElement.style.transform = 'translateX(20px)';
        setTimeout(() => {
            if (feedbackElement.parentNode) {
                feedbackElement.parentNode.removeChild(feedbackElement);
            }
        }, 300);
    }, 5000);
}


// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animateElements = document.querySelectorAll(
        '.stat-card, .spec-card, .skill-category, .project-card, .experience-item'
    );
    
    animateElements.forEach(el => observer.observe(el));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Optimize scroll handlers with throttling
const optimizedScrollHandler = throttle(() => {
    updateActiveSection();
    handleScrollEffects();
    updateScrollProgress();
}, 16); // ~60fps

// Replace multiple scroll listeners with single optimized handler
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Handle Escape key to close mobile menu
    if (e.key === 'Escape' && isMobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Handle Enter key on buttons
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Removed intrusive auto-scroll on focus for a calmer, predictable UX

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
    console.error('Portfolio website error:', e.error);
    // You can add error reporting here
});

// === Animated Logo Orb ===
// --- Simple 3D noise function for fluid-like motion ---
function fract(x) { return x - Math.floor(x); }
function pseudoNoise3D(x, y, z) {
    // Hash-based pseudo-noise in [0,1)
    return fract(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453);
}

function animateLogoOrb() {
    const canvas = document.getElementById('logo-orb');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = 15; // sphere radius
    const N = 700; // lighter for performance and subtlety
    const nodes = [];
    for (let i = 0; i < N; i++) {
        // Spherical coordinates
        const phi = Math.acos(1 - 2 * (i + 0.5) / N); // latitude
        const theta = Math.PI * (1 + Math.sqrt(5)) * i; // longitude (golden angle)
        // Each node gets a random phase for subtle variation
        const phase = Math.random() * Math.PI * 2;
        nodes.push({phi, theta, phase});
    }
    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        // Sphere rotation
        const rotY = t * 0.25;
        const rotX = Math.sin(t * 0.15) * 0.2;
        // Global splash wave
        const splashWave = Math.sin(t * 0.18) * 0.9 + Math.cos(t * 0.09) * 0.7;
        for (let i = 0; i < N; i++) {
            let node = nodes[i];
            // Convert spherical to cartesian for noise sampling
            let x0 = Math.sin(node.phi) * Math.cos(node.theta);
            let y0 = Math.sin(node.phi) * Math.sin(node.theta);
            let z0 = Math.cos(node.phi);
            // Sample 3D pseudo-noise field for fluid-like velocity
            let n1 = pseudoNoise3D(x0 + t * 0.12, y0, z0);
            let n2 = pseudoNoise3D(x0, y0 + t * 0.12, z0);
            let n3 = pseudoNoise3D(x0, y0, z0 + t * 0.12);
            // Curl-like effect: use noise to perturb theta/phi
            let dTheta = (n1 - 0.5) * 0.25; // subtle swirl
            let dPhi = (n2 - 0.5) * 0.2 + Math.sin(t * 0.4 + node.phase) * 0.04;
            // Minimal radial variance
            let dR = (n3 - 0.5) * 0.6;
            // Apply perturbation
            let phiWavy = node.phi + dPhi;
            let thetaWavy = node.theta + dTheta;
            let rWavy = R + dR;
            // Spherical to Cartesian
            let x = Math.sin(phiWavy) * Math.cos(thetaWavy);
            let y = Math.sin(phiWavy) * Math.sin(thetaWavy);
            let z = Math.cos(phiWavy);
            // Rotate around Y axis
            let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
            let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
            // Rotate around X axis
            let y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
            let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
            // Perspective
            const persp = 0.7 + 0.6 * (z2 + 1) / 2;
            const px = cx + x1 * rWavy * persp;
            const py = cy + y1 * rWavy * persp;
            // Node color: red solid
            ctx.beginPath();
            ctx.arc(px, py, 0.9 * persp, 0, 2 * Math.PI);
            const depthAlpha = 0.25 + 0.55 * (z2 + 1) / 2; // 0.25–0.8
            ctx.fillStyle = `rgba(203, 27, 69, ${depthAlpha})`; // crimson with depth
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        t += 0.004; // gentle motion
        requestAnimationFrame(draw);
    }
    draw();
}

window.addEventListener('DOMContentLoaded', animateLogoOrb);