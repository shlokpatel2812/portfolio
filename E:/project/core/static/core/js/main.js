/**
 * Main JavaScript - GSAP Animations & SPA Navigation
 * Premium Portfolio Interactions
 */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ========================================
// CUSTOM CURSOR
// ========================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // Immediate cursor movement
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
});

// Smooth follower animation
function animateCursor() {
    followerX += (cursorX - followerX) * 0.15;
    followerY += (cursorY - followerY) * 0.15;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('[data-cursor], a, button, .nav-link, .preview-card, .project-panel');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        
        const cursorText = el.getAttribute('data-cursor');
        if (cursorText) {
            cursorFollower.innerHTML = cursorText;
            cursorFollower.style.fontSize = '10px';
            cursorFollower.style.display = 'flex';
            cursorFollower.style.alignItems = 'center';
            cursorFollower.style.justifyContent = 'center';
            cursorFollower.style.fontFamily = 'var(--font-body)';
            cursorFollower.style.textTransform = 'uppercase';
            cursorFollower.style.letterSpacing = '1px';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        cursorFollower.innerHTML = '';
    });
});

// ========================================
// TYPING EFFECT FOR HERO SUBTITLE
// ========================================
const typingTexts = [
    'Building digital experiences',
    'Crafting elegant solutions',
    'Designing the future',
    'Code meets creativity'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');

function typeText() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 30 : 80;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeText, typeSpeed);
}

// Start typing effect after page load
setTimeout(typeText, 1000);

// ========================================
// GSAP ENTRANCE ANIMATIONS
// ========================================
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.to('.display-title', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: 0.5
})
.to('.subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8
}, '-=0.6')
.to('.scroll-indicator', {
    opacity: 1,
    duration: 0.6
}, '-=0.4');

// ========================================
// SPA NAVIGATION - SMOOTH SCROLL WITH TRANSITION
// ========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const pageOverlay = document.getElementById('pageOverlay');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Play overlay transition
            gsap.to(pageOverlay, {
                scaleY: 1,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    // Scroll to section
                    targetSection.scrollIntoView({ behavior: 'auto' });
                    
                    // Update active nav state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Update URL hash
                    window.location.hash = targetId;
                    
                    // Reverse overlay
                    gsap.to(pageOverlay, {
                        scaleY: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        delay: 0.1
                    });
                }
            });
        }
    });
});

// ========================================
// SECTION ACTIVE STATE WITH INTERSECTION OBSERVER
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            
            // Update nav active state
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
            
            // Update URL hash without scrolling
            history.replaceState(null, null, `#${id}`);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ========================================
// STATS COUNTER ANIMATION
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
            gsap.to(stat, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: 'power2.out'
            });
        }
    });
});

// ========================================
// WORK PREVIEW CARDS ANIMATION
// ========================================
gsap.from('.preview-card', {
    scrollTrigger: {
        trigger: '.work-preview',
        start: 'top 70%'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// ========================================
// HORIZONTAL SCROLL FOR WORK SECTION
// ========================================
const workSection = document.querySelector('.work-section');
const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');

if (workSection && horizontalWrapper) {
    gsap.to(horizontalWrapper, {
        x: () => -(horizontalWrapper.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '.work-section',
            start: 'top top',
            end: () => `+=${horizontalWrapper.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
}

// ========================================
// ABOUT SECTION ANIMATIONS
// ========================================
gsap.from('.bio-paragraph', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 60%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

gsap.from('.timeline-item', {
    scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%'
    },
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
});

// ========================================
// CONTACT SECTION ANIMATIONS
// ========================================
gsap.from('.contact-email', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 60%'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.social-link', {
    scrollTrigger: {
        trigger: '.social-links',
        start: 'top 70%'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
});

gsap.from('.form-group', {
    scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 70%'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out'
});

// ========================================
// AJAX CONTACT FORM SUBMISSION
// ========================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    
    try {
        const response = await fetch('/contact/submit/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            formMessage.textContent = data.message;
            formMessage.className = 'form-message success';
            contactForm.reset();
            
            // Clear form message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        } else {
            throw new Error(data.message || 'Submission failed');
        }
    } catch (error) {
        formMessage.textContent = 'Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
        
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span>';
    }
});

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
const magneticButtons = document.querySelectorAll('.submit-btn, .preview-card, .project-panel');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// ========================================
// PARALLAX EFFECT FOR PROJECT PANELS
// ========================================
const projectPanels = document.querySelectorAll('.project-panel');

projectPanels.forEach(panel => {
    gsap.to(panel.querySelector('.project-image-placeholder'), {
        y: -50,
        scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// ========================================
// INITIAL PAGE LOAD - CHECK HASH
// ========================================
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            // Small delay to allow page to settle
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Reduce animations on mobile
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0);
}

// Console branding
console.log('%c CREATIVE DEVELOPER ', 'background: #000; color: #fff; font-size: 20px; padding: 10px 20px;');
console.log('%c Premium Portfolio Built with Django, Three.js & GSAP ', 'color: #666; font-size: 12px;');
