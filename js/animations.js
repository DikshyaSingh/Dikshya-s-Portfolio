// Advanced animations and effects
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupMorphingShapes();
        this.setupGlitchEffects();
    }

    // Intersection Observer for scroll-triggered animations
    setupIntersectionObservers() {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with fade-in classes
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in')
            .forEach(el => fadeInObserver.observe(el));

        this.observers.set('fadeIn', fadeInObserver);
    }

    // Advanced scroll animations
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Parallax elements
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            // Reveal animations based on scroll position
            document.querySelectorAll('[data-reveal]').forEach(element => {
                const elementTop = element.offsetTop;
                const elementHeight = element.offsetHeight;
                const revealPoint = 150;

                if (scrollY + windowHeight - revealPoint > elementTop && 
                    scrollY < elementTop + elementHeight) {
                    element.classList.add('revealed');
                } else {
                    element.classList.remove('revealed');
                }
            });

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate);
    }

    // Enhanced hover effects
    setupHoverEffects() {
        // Magnetic effect for buttons
        document.querySelectorAll('.btn, .project-card, .skill-item').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                element.classList.add('magnetic-active');
            });

            element.addEventListener('mousemove', (e) => {
                if (!element.classList.contains('magnetic-active')) return;

                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const strength = 0.1;
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('magnetic-active');
                element.style.transform = '';
            });
        });

        // Tilt effect for cards
        document.querySelectorAll('.project-card, .skill-category, .value-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Morphing blob shapes
    setupMorphingShapes() {
        const createMorphingBlob = (container) => {
            const blob = document.createElement('div');
            blob.className = 'morphing-blob';
            container.appendChild(blob);

            // Random morphing animation
            setInterval(() => {
                const randomRadius = () => Math.random() * 30 + 30;
                const borderRadius = `${randomRadius()}% ${randomRadius()}% ${randomRadius()}% ${randomRadius()}%`;
                blob.style.borderRadius = borderRadius;
            }, 2000);
        };

        document.querySelectorAll('.blob-container').forEach(createMorphingBlob);
    }

    // Glitch text effects
    setupGlitchEffects() {
        document.querySelectorAll('.glitch-text').forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);

            // Random glitch trigger
            setInterval(() => {
                if (Math.random() > 0.95) {
                    element.classList.add('glitching');
                    setTimeout(() => {
                        element.classList.remove('glitching');
                    }, 200);
                }
            }, 100);
        });
    }

    // Particle system
    createParticleSystem(container, options = {}) {
        const defaults = {
            count: 50,
            color: '#ff6b9d',
            size: 2,
            speed: 1,
            direction: 'up'
        };

        const config = { ...defaults, ...options };
        const particles = [];

        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${config.size}px;
                height: ${config.size}px;
                background: ${config.color};
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;

            container.appendChild(particle);
            particles.push({
                element: particle,
                x: Math.random() * container.offsetWidth,
                y: Math.random() * container.offsetHeight,
                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed
            });
        }

        const animateParticles = () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = container.offsetWidth;
                if (particle.x > container.offsetWidth) particle.x = 0;
                if (particle.y < 0) particle.y = container.offsetHeight;
                if (particle.y > container.offsetHeight) particle.y = 0;

                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();
        return particles;
    }

    // Text scramble effect
    scrambleText(element, finalText, duration = 2000) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const length = finalText.length;
        let frame = 0;
        const totalFrames = duration / 16; // 60fps

        const animate = () => {
            let scrambled = '';
            for (let i = 0; i < length; i++) {
                if (frame > totalFrames * (i / length)) {
                    scrambled += finalText[i];
                } else {
                    scrambled += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            element.textContent = scrambled;
            frame++;

            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalText;
            }
        };

        animate();
    }

    // Wave text animation
    waveText(element) {
        const text = element.textContent;
        element.innerHTML = '';

        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                animation: wave 2s ease-in-out infinite;
                animation-delay: ${i * 0.1}s;
            `;
            element.appendChild(span);
        });

        // Add wave keyframes if not already present
        if (!document.querySelector('#wave-keyframes')) {
            const style = document.createElement('style');
            style.id = 'wave-keyframes';
            style.textContent = `
                @keyframes wave {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Typewriter effect with cursor
    typeWriter(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;

        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.cssText = `
            animation: blink 1s infinite;
            color: var(--primary-color);
        `;
        element.appendChild(cursor);

        const type = () => {
            if (i < text.length) {
                element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    // Staggered animation for lists
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // Smooth counter animation
    animateCounter(element, start, end, duration = 2000) {
        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (difference * easeOut));
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };

        requestAnimationFrame(step);
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for use in other files
window.AnimationController = AnimationController;
window.animationController = animationController;

// Additional utility animations
const AnimationUtils = {
    // Fade in animation
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Fade out animation
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Slide animation
    slideIn(element, direction = 'left', duration = 300) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        element.style.transform = transforms[direction];
        element.style.opacity = '0';
        element.style.display = 'block';

        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            element.style.transform = `${transforms[direction].replace('100%', `${100 * (1 - easeOut)}%`)}`;
            element.style.opacity = progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = '';
                element.style.opacity = '';
            }
        };

        requestAnimationFrame(animate);
    },

    // Scale animation
    scaleIn(element, duration = 300) {
        element.style.transform = 'scale(0)';
        element.style.opacity = '0';
        element.style.display = 'block';

        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            element.style.transform = `scale(${easeOut})`;
            element.style.opacity = progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = '';
                element.style.opacity = '';
            }
        };

        requestAnimationFrame(animate);
    }
};

window.AnimationUtils = AnimationUtils;