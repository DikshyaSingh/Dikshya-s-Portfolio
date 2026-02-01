// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounters();
    initParallax();
    initMagneticEffect();
    initTiltEffect();
    initSmoothScrolling();
    initPageTransitions();
    initTypingEffect();
    initParticles();
});

// Navigation functionality using GSAP
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navContent = document.getElementById('card-nav-content');
    const navCards = document.querySelectorAll('.nav-card');

    let isExpanded = false;
    let tl = null;

    const calculateHeight = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            // Temporarily show content to measure height
            const wasVisible = navContent.style.visibility;
            const wasPointerEvents = navContent.style.pointerEvents;
            const wasPosition = navContent.style.position;
            const wasHeight = navContent.style.height;

            navContent.style.visibility = 'visible';
            navContent.style.pointerEvents = 'auto';
            navContent.style.position = 'static';
            navContent.style.height = 'auto';

            const topBar = 60;
            const padding = 16;
            const contentHeight = navContent.scrollHeight;

            navContent.style.visibility = wasVisible;
            navContent.style.pointerEvents = wasPointerEvents;
            navContent.style.position = wasPosition;
            navContent.style.height = wasHeight;

            return topBar + contentHeight + padding;
        }
        return 260; // Desktop expanded height
    };

    const createTimeline = () => {
        if (tl) tl.kill();

        gsap.set(navbar, { height: 60, overflow: 'hidden' });
        gsap.set(navCards, { y: 50, opacity: 0 });

        const newTl = gsap.timeline({ paused: true });

        newTl.to(navbar, {
            height: calculateHeight,
            duration: 0.4,
            ease: "power3.out"
        });

        newTl.to(navCards, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.08
        }, '-=0.1');

        return newTl;
    };

    tl = createTimeline();

    const toggleMenu = () => {
        if (!isExpanded) {
            isExpanded = true;
            hamburger.classList.add('open');
            navContent.classList.add('visible');
            tl.play(0);
        } else {
            isExpanded = false;
            hamburger.classList.remove('open');
            tl.eventCallback('onReverseComplete', () => {
                navContent.classList.remove('visible');
            });
            tl.reverse();
        }
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isExpanded && !navbar.contains(e.target)) {
            toggleMenu();
        }
    });

    // Re-calculate height on resize
    window.addEventListener('resize', () => {
        const wasExpanded = isExpanded;
        if (wasExpanded) {
            const newHeight = calculateHeight();
            gsap.set(navbar, { height: newHeight });
        }
        tl = createTimeline();
        if (wasExpanded) {
            tl.progress(1);
        }
    });

}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Special handling for staggered animations
                if (entry.target.classList.contains('stagger-container')) {
                    const children = entry.target.querySelectorAll('.stagger-animation');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-slide-left, .animate-slide-right, ' +
        '.animate-fade-in, .animate-scale, .stagger-container, ' +
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );

    animatedElements.forEach(el => observer.observe(el));
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Parallax effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.setProperty('--scroll-y', `${rate}px`);
        });
    });
}

// Magnetic effect for buttons and cards
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.setProperty('--x', `${x * 0.1}px`);
            element.style.setProperty('--y', `${y * 0.1}px`);
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--x', '0px');
            element.style.setProperty('--y', '0px');
        });
    });
}

// Tilt effect for cards
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.tilt-card');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            element.style.setProperty('--rotate-x', `${rotateX}deg`);
            element.style.setProperty('--rotate-y', `${rotateY}deg`);
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--rotate-x', '0deg');
            element.style.setProperty('--rotate-y', '0deg');
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Page transitions
function initPageTransitions() {
    const pageLinks = document.querySelectorAll('a[href$=".html"]');
    const transition = document.querySelector('.page-transition');

    if (!transition) {
        // Create transition element if it doesn't exist
        const transitionEl = document.createElement('div');
        transitionEl.className = 'page-transition';
        document.body.appendChild(transitionEl);
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            document.querySelector('.page-transition').classList.add('active');

            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// Typing effect for hero text
function initTypingEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');

    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none'
                        ? '2px solid var(--primary-color)'
                        : 'none';
                }, 500);
            }
        };

        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    });
}

// Particle system
function initParticles() {
    const particleContainers = document.querySelectorAll('.particles');

    particleContainers.forEach(container => {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            container.appendChild(particle);
        }
    });
}

// Skill progress bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width;
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Progress circles animation
function initProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');

    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                circleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressCircles.forEach(circle => circleObserver.observe(circle));
}

// Reveal text animation
function initRevealText() {
    const revealElements = document.querySelectorAll('.reveal-text');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    revealElements.forEach(element => revealObserver.observe(element));
}

// Sparkle effect
function initSparkles() {
    const sparkleContainers = document.querySelectorAll('.sparkle-container');

    sparkleContainers.forEach(container => {
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(sparkle);
        }
    });
}

// Loading animations
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.zIndex = '9999';
    document.body.appendChild(loader);

    return loader;
}

function hideLoading(loader) {
    if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Handle scroll-based animations here
    initParallax();
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize skill bars and other animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSkillBars();
    initProgressCircles();
    initRevealText();
    initSparkles();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Export functions for use in other files
window.portfolioUtils = {
    showLoading,
    hideLoading,
    debounce,
    throttle
};