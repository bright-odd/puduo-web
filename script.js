
// Close menu when clicking on a menu link or pressing Escape
function closeMenuIfOpen() {
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
}

// Close on menu link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenuIfOpen);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)) {
        closeMenuIfOpen();
    }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMenuIfOpen();
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            closeMenuIfOpen();
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Modal Functionality
const serviceModal = document.getElementById('serviceModal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const cancelBtn = document.getElementById('cancelBtn');
const serviceForm = document.getElementById('serviceForm');

// Open Modal
function openModal() {
    if (serviceModal) {
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal
function closeModal() {
    if (serviceModal) {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form
        if (serviceForm) {
            serviceForm.reset();
        }
    }
}

// Button Click Handlers - only the navigation CTA opens the Service Request modal
const navCta = document.querySelector('.nav-cta');
if (navCta) {
    navCta.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
    });
}

// Delegate: open service modal for any element with `.request-service-btn` (works across pages)
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.request-service-btn');
    if (!btn) return;
    // ignore clicks that originate from inside the modal
    if (e.target.closest('#serviceModal')) return;
    e.preventDefault();
    if (typeof openModal === 'function') {
        openModal();
    } else if (window.sharedServiceModal && typeof window.sharedServiceModal.open === 'function') {
        window.sharedServiceModal.open();
    }
});

// Close modal handlers
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('active')) {
        closeModal();
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') +
                (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') +
                (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const target = parseInt(statNumber.textContent);
                entry.target.classList.add('animated');
                animateCounter(statNumber, target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Service Form Submission
if (serviceForm) {
    serviceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Validate required fields
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!fullName) {
            alert('Please enter your full name');
            return;
        }

        if (!email || !validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!phone) {
            alert('Please enter your phone number');
            return;
        }

        if (!service) {
            alert('Please select a service');
            return;
        }

        if (!message) {
            alert('Please provide project details');
            return;
        }

        // Simulate form submission (replace with actual API call)
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', data);

            // Show success message
            alert('Thank you! Your service request has been submitted. We\'ll get back to you within 24 hours.');

            // Reset form and close modal
            this.reset();
            closeModal();

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

// Info Modal Functionality
const infoModal = document.getElementById('infoModal');
const infoModalClose = document.querySelector('.info-modal-close');
const infoModalOverlay = infoModal ? infoModal.querySelector('.modal-overlay') : null;

// Service Information Data
const serviceInfo = {
    'services': {
        title: 'SERVICES',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#ECFDF5"/><path d="M20 24L24 28L32 20" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        description: 'Comprehensive services covering web, mobile, custom software, DevOps, cloud architecture, and ongoing support.',
        features: [
            'WEB APPLICATION DEVELOPMENT - We develop sophisticated, enterprise-grade web applications, portals, and dashboards. Our focus is on rebuilding or modernizing core business processes accessible via the browser. Includes secure user authentication, complex transactional systems, microservices architecture, and API consumption. Provides a centralized, accessible platform for internal operations or external stakeholder engagement, replacing spreadsheet and email-driven workflows.',
            'MOBILE APPLICATION DEVELOPMENT - We build native (iOS and Android) and cross-platform mobile applications optimized for the African market\'s "mobile-first" reality. Includes secure payment gateway integration (MoMo, local banking APIs), biometric authentication, offline functionality, and intuitive UI/UX design. Transforms how clients interact with their customers or members, driving engagement, facilitating instant payments, and reducing administrative load.',
            'CUSTOM SOFTWARE ENGINEERING - We specialize in system re-engineering and the development of bespoke, complex applications to address unique operational gaps not covered by off-the-shelf software. Includes legacy system modernization, custom ERP modules, data migration strategy, and development of high-load processing engines. Extends the lifecycle of core business assets while introducing modern security and scalability features.',
            'DEVOPS CONSULTING & AUTOMATION - We enable high-velocity, continuous software delivery through the implementation of robust automation pipelines. Includes CI/CD pipeline setup, Infrastructure as Code (Terraform), containerization using Docker and Kubernetes. Reduces manual deployment errors, accelerates feature releases, and ensures consistent environments from development to production.',
            'CLOUD ARCHITECTURE, MIGRATION & MANAGED SERVICES - We provide strategic guidance and technical execution for leveraging hyperscale cloud platforms (AWS, Azure, GCP). Includes lift-and-shift workload migration, serverless and microservices architecture design, cloud cost optimization (FinOps), and disaster recovery planning. Enables elasticity and scalability to handle unpredictable demand while ensuring geographic redundancy and regulatory compliance.',
            'ONGOING SUPPORT & MAINTENANCE - We guarantee the long-term viability and stability of all deployed solutions. Includes 24/7 monitoring, incident response, patching, vulnerability scanning, and feature enhancement backlogs. Ensures business continuity and protects investment by keeping software dependencies current and mitigating emerging threats.'
        ]
    },
    'consulting': {
        title: 'CONSULTING',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#EFF6FF"/><path d="M24 16L32 24H28V32H20V24H16L24 16Z" fill="#2563EB"/></svg>',
        description: 'Strategic guidance for cybersecurity and IT transformation.',
        features: [
            'CYBERSECURITY - We adopt a preventative security posture, integrating security practices throughout the software development lifecycle (DevSecOps). Includes threat modeling, code vulnerability analysis, compliance auditing (e.g., Ghana Data Protection Act), and security architecture reviews. Minimizes exposure to breaches and financial loss by identifying and eliminating vulnerabilities early. Result: Certified compliance and a strong, defensible security framework.',
            'IT CONSULTING - We provide strategic guidance for technology investment, digital transformation, and executive-level decision support. Includes technology due-diligence, platform feasibility studies, digital maturity assessments, and vendor management strategy. Ensures technology investments align directly with business goals and financial forecasts. Result: A clear digital transformation roadmap with defined ROI metrics.'
        ]
    },
    'training': {
        title: 'TRAINING',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#FEE2E2"/><path d="M24 20V28M24 16V18" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="24" r="8" stroke="#EF4444" stroke-width="3"/></svg>',
        description: 'Upskill teams/individuals on modern engineering practices.',
        features: [
            'ENGINEERING CAPABILITY DEVELOPMENT - We deliver training programs that upskill internal teams on modern engineering practices. Includes custom workshops on DevOps tooling, cloud administration, secure coding, and advanced software architecture principles. Increases the self-sufficiency of client IT teams, reducing reliance on external consultants for day-to-day operations. Result: A highly competent internal engineering team capable of managing and maintaining deployed platforms.'
        ]
    },
    'overview': {
        title: 'About TechSolutions',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#2563EB"/><path d="M24 16L32 24H28V32H20V24H16L24 16Z" fill="white"/><path d="M24 28L14 22H18V16H22V22H26L24 28Z" fill="white"/></svg>',
        description: 'TechSolutions is a leading IT services company with over 15 years of experience helping businesses transform through technology. We combine technical expertise with business acumen to deliver solutions that drive real results.',
        features: [
            '15+ years of industry experience',
            '500+ successful projects',
            'Expert team of 50+ professionals',
            '98% client satisfaction rate',
            'Award-winning solutions',
            'Global client base'
        ]
    }
};

// Open Info Modal
function openInfoModal(serviceKey) {
    if (!infoModal || !serviceInfo[serviceKey]) return;

    const service = serviceInfo[serviceKey];
    const modalIcon = document.getElementById('infoModalIcon');
    const modalTitle = document.getElementById('infoModalTitle');
    const modalContent = document.getElementById('infoModalContent');
    const modalFeatures = document.getElementById('infoModalFeatures');

    // Set icon
    if (modalIcon) {
        modalIcon.innerHTML = service.icon;
    }

    // Set title
    if (modalTitle) {
        modalTitle.textContent = service.title;
    }

    // Set description
    if (modalContent) {
        modalContent.textContent = service.description;
    }

    // Set features (plain text)
    if (modalFeatures && service.features) {
        modalFeatures.innerHTML = `
            <h3>Key</h3>
            <ul class="info-features-list">
                ${service.features.map(feature => `
                    <li class="info-feature-item">
                        <div class="info-feature-icon">✓</div>
                        <div class="info-feature-text"></div>
                    </li>
                `).join('')}
            </ul>
        `;
        // Set textContent for each feature (no HTML)
        const featureTextEls = modalFeatures.querySelectorAll('.info-feature-text');
        service.features.forEach((feature, i) => {
            if (featureTextEls[i]) featureTextEls[i].textContent = feature;
        });
    }

    // Show modal
    infoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Info Modal
function closeInfoModal() {
    if (infoModal) {
        infoModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Event listeners for "Learn More" links
document.querySelectorAll('.service-link[data-service]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const serviceKey = this.getAttribute('data-service');
        openInfoModal(serviceKey);
    });
});

// Event listeners for "Learn More" buttons
document.querySelectorAll('button[data-service]').forEach(button => {
    button.addEventListener('click', function (e) {
        const serviceKey = this.getAttribute('data-service');
        if (serviceKey) {
            e.preventDefault();
            openInfoModal(serviceKey);
        }
    });
});

// Close info modal handlers
if (infoModalClose) {
    infoModalClose.addEventListener('click', closeInfoModal);
}

if (infoModalOverlay) {
    infoModalOverlay.addEventListener('click', closeInfoModal);
}

// Close info modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModal && infoModal.classList.contains('active')) {
        closeInfoModal();
    }
});

/* Team Modal Functionality */
const teamModal = document.getElementById('teamModal');
const teamModalClose = document.querySelector('.team-modal-close');
const teamModalOverlay = teamModal ? teamModal.querySelector('.modal-overlay') : null;

function openTeamModalFromCard(cardEl) {
    if (!teamModal || !cardEl) return;
    const nameEl = cardEl.querySelector('.team-name');
    const roleEl = cardEl.querySelector('.team-role');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const role = roleEl ? roleEl.textContent.trim() : '';
    const bio = cardEl.dataset.bio || '';
    const image = cardEl.dataset.image || '';
    const twitter = cardEl.dataset.twitter || '';
    const linkedin = cardEl.dataset.linkedin || '';
    const github = cardEl.dataset.github || '';

    const modalName = document.getElementById('teamModalName');
    const modalRole = document.getElementById('teamModalRole');
    const modalBio = document.getElementById('teamModalBio');
    const modalImage = document.getElementById('teamModalImage');
    const modalSocial = document.getElementById('teamModalSocial');

    if (modalName) modalName.textContent = name;
    if (modalRole) modalRole.textContent = role;
    if (modalBio) modalBio.textContent = bio;
    if (modalImage && image) {
        modalImage.src = image;
        modalImage.alt = `${name} - ${role}`;
    }

    if (modalSocial) {
        modalSocial.innerHTML = '';
        if (twitter) {
            modalSocial.insertAdjacentHTML('beforeend', `<a href="${twitter}" target="_blank" rel="noopener noreferrer" aria-label="Twitter">${svgIcon('twitter')}</a>`);
        }
        if (linkedin) {
            modalSocial.insertAdjacentHTML('beforeend', `<a href="${linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${svgIcon('linkedin')}</a>`);
        }
        if (github) {
            modalSocial.insertAdjacentHTML('beforeend', `<a href="${github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${svgIcon('github')}</a>`);
        }
    }

    teamModal.classList.add('active');
    teamModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeTeamModal() {
    if (!teamModal) return;
    teamModal.classList.remove('active');
    teamModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function svgIcon(name) {
    if (name === 'twitter') return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 7.5c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.4-1.8-.7.4-1.4.7-2.2.8C16.6 6.6 15.8 6 15 6c-1.6 0-2.9 1.4-2.9 3.1 0 .2 0 .5.1.7C9.2 9.6 6.3 8 4.3 5.6c-.3.6-.5 1.3-.5 2 0 1.4.8 2.6 2 3.3-.6 0-1.2-.2-1.7-.5v.1c0 2 1.4 3.7 3.2 4.1-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.4 1.6 2.4 3 2.5-1.1.9-2.5 1.4-4 1.4-.3 0-.6 0-.9-.1 1.5.9 3.3 1.4 5.1 1.4 6.1 0 9.5-5 9.5-9.4v-.4c.6-.4 1.2-.9 1.6-1.5-.6.3-1.3.6-2 .6z" fill="currentColor"/></svg>';
    if (name === 'linkedin') return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H3V21H6V9ZM4.5 3C3.67 3 3 3.67 3 4.5C3 5.33 3.67 6 4.5 6C5.33 6 6 5.33 6 4.5C6 3.67 5.33 3 4.5 3ZM21 21H18V14.5C18 12.57 16.43 11 14.5 11C12.57 11 11 12.57 11 14.5V21H8V9H11V10.5C11.7 9.5 13.07 9 14.5 9C17.54 9 20 11.46 20 14.5V21H21Z" fill="currentColor"/></svg>';
    if (name === 'github') return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.7 2 1 .1-.8.4-1.4.8-1.8-2.7-.3-5.6-1.4-5.6-6.1 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.4 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.4-1.5 3.4-1.2 3.4-1.2.6 1.8.2 3.1.1 3.4.8.8 1.2 1.9 1.2 3.2 0 4.7-2.9 5.8-5.6 6.1.4.3.8 1 .8 2v3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" fill="currentColor"/></svg>';
    return '';
}

// Attach click & keyboard handlers to team cards
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', function (e) {
        openTeamModalFromCard(this);
    });

    card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openTeamModalFromCard(this);
        }
    });
});

if (teamModalClose) teamModalClose.addEventListener('click', closeTeamModal);
if (teamModalOverlay) teamModalOverlay.addEventListener('click', closeTeamModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && teamModal && teamModal.classList.contains('active')) {
        closeTeamModal();
    }
});

/* Talk To Us Modal Functionality */
const talkModal = document.getElementById('talkModal');
const talkModalClose = document.querySelector('.talk-modal-close');
const talkModalOverlay = talkModal ? talkModal.querySelector('.modal-overlay') : null;
const talkForm = document.getElementById('talkForm');

function openTalkModal() {
    if (!talkModal) return;
    talkModal.classList.add('active');
    talkModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = talkModal.querySelector('input[name="name"]') || talkModal.querySelector('input');
    if (first) first.focus();
}

function closeTalkModal() {
    if (!talkModal) return;
    talkModal.classList.remove('active');
    talkModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (talkForm) talkForm.reset();
}

// Open talk modal for any button containing 'Talk to Us'
document.querySelectorAll('button').forEach(btn => {
    try {
        const txt = (btn.textContent || '').trim();
        if (txt && txt.includes('Talk to Us')) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openTalkModal();
            });
        }
    } catch (err) {
        // ignore
    }
});

if (talkModalClose) talkModalClose.addEventListener('click', closeTalkModal);
if (talkModalOverlay) talkModalOverlay.addEventListener('click', closeTalkModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && talkModal && talkModal.classList.contains('active')) {
        closeTalkModal();
    }
});

if (talkForm) {
    talkForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('talk-name').value.trim();
        const email = document.getElementById('talk-email').value.trim();
        const phone = document.getElementById('talk-phone').value.trim();
        const message = document.getElementById('talk-message').value.trim();

        if (!name) { alert('Please enter your name'); return; }
        if (!email || !validateEmail(email)) { alert('Please enter a valid email'); return; }

        const submitBtn = this.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

        // Simulate API call
        setTimeout(() => {
            if (submitBtn) { submitBtn.textContent = origText; submitBtn.disabled = false; }
            alert('Thank you! We received your message — we will respond shortly.');
            closeTalkModal();
        }, 1000);
    });
    // wire cancel button inside form
    const cancelBtnTalk = document.querySelector('.talk-cancel');
    if (cancelBtnTalk) cancelBtnTalk.addEventListener('click', closeTalkModal);
}

/* CEO Video Modal Functionality */
const ceoBtn = document.getElementById('ceoBtn');
const ceoModal = document.getElementById('ceoModal');
const ceoModalClose = document.querySelector('.ceo-modal-close');
const ceoModalOverlay = ceoModal ? ceoModal.querySelector('.modal-overlay') : null;
const ceoVideo = document.getElementById('ceoVideo');

function openCeoModal(videoSrc) {
    if (!ceoModal) return;
    // set source if provided
    if (videoSrc && ceoVideo) {
        const srcEl = ceoVideo.querySelector('source');
        if (srcEl) srcEl.src = videoSrc;
        try { ceoVideo.load(); } catch (e) { }
    }
    ceoModal.classList.add('active');
    ceoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // autoplay if possible
    setTimeout(() => { try { ceoVideo && ceoVideo.play(); } catch (e) { } }, 250);
}

function closeCeoModal() {
    if (!ceoModal) return;
    ceoModal.classList.remove('active');
    ceoModal.setAttribute('aria-hidden', 'true');
    try { if (ceoVideo) { ceoVideo.pause(); ceoVideo.currentTime = 0; } } catch (e) { }
    document.body.style.overflow = '';
}

if (ceoBtn) {
    ceoBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const src = this.dataset.video;
        openCeoModal(src);
    });
}

if (ceoModalClose) ceoModalClose.addEventListener('click', closeCeoModal);
if (ceoModalOverlay) ceoModalOverlay.addEventListener('click', closeCeoModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ceoModal && ceoModal.classList.contains('active')) {
        closeCeoModal();
    }
});

// ============================================================================
// PROJECT PAGE FILTERING & ANIMATIONS
// ============================================================================

// Only run on projects page
if (document.getElementById('projectsGrid')) {
    const projectsGrid = document.getElementById('projectsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const industryFilter = document.getElementById('industryFilter');
    const projectCards = document.querySelectorAll('.project-card');

    let currentCategory = 'all';
    let currentIndustry = 'all';

    /**
     * Filter projects based on category and industry
     */
    function filterProjects() {
        projectCards.forEach((card) => {
            const cardCategory = card.getAttribute('data-category');
            const cardIndustry = card.getAttribute('data-industry');

            let categoryMatch;
            if (currentCategory === 'all') {
                categoryMatch = true;
            } else if (currentCategory === 'application') {
                // "Application" groups together mobile and desktop projects
                categoryMatch = cardCategory === 'mobile' || cardCategory === 'desktop' || cardCategory === 'application';
            } else {
                categoryMatch = cardCategory === currentCategory;
            }
            const industryMatch = currentIndustry === 'all' || cardIndustry === currentIndustry;

            if (categoryMatch && industryMatch) {
                // Show card
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.animation = 'cardFadeIn 400ms ease-out forwards';
                }, 10);
            } else {
                // Hide card with animation
                card.classList.add('hidden');
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Smooth scroll to grid
        projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Category filter button click handler
     */
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active state
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            // Update category and filter
            currentCategory = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    /**
     * Industry dropdown change handler
     */
    industryFilter.addEventListener('change', (e) => {
        currentIndustry = e.target.value;
        filterProjects();
    });

    /**
     * Intersection Observer for scroll animations
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach((card) => {
        observer.observe(card);
    });
}

// Console message
console.log('%c🚀 TechSolutions - Modern Project Showcase', 'font-size: 18px; font-weight: bold; color: #FF006E; text-shadow: 0 0 10px rgba(255, 0, 110, 0.5);');
console.log('%cNeon-gradient design with vanilla JavaScript filtering', 'font-size: 12px; color: #00D9FF;');





