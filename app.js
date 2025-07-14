// NexusCorp Dark Theme Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavigation();
    initAnimatedCounters();
    initTestimonialSlider();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
    initParticles();
    initCTAButtons();
    initScrollIndicator();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Active Navigation Link Highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', debounce(updateActiveNavigation, 10));
    updateActiveNavigation();
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const current = parseInt(counter.textContent);
            const increment = target / 100;
            
            if (current < target) {
                counter.textContent = Math.ceil(current + increment);
                setTimeout(() => animateCounters(), 20);
            } else {
                counter.textContent = target + '+';
            }
        });
    }
    
    function checkCounterVisibility() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection && !animated) {
            const rect = aboutSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                animated = true;
                animateCounters();
            }
        }
    }
    
    window.addEventListener('scroll', debounce(checkCounterVisibility, 10));
    checkCounterVisibility();
}

// Testimonial Slider
function initTestimonialSlider() {
    const slider = document.getElementById('testimonialSlider');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % cards.length;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + cards.length) % cards.length;
        showSlide(prevIndex);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    if (cards.length > 0) {
        // Initialize first slide
        showSlide(0);
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Start auto-slide
        startAutoSlide();
    }
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Clear previous errors
            clearFormErrors();
            
            let isValid = true;
            
            // Validate name
            if (!name || name.trim().length < 2) {
                showFieldError('name', 'Name must be at least 2 characters long');
                isValid = false;
            }
            
            // Validate email
            if (!email || !isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone (optional)
            if (phone && !isValidPhone(phone)) {
                showFieldError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.trim().length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long');
                isValid = false;
            }
            
            if (isValid) {
                showSuccessMessage('Thank you for your message! We will get back to you soon.');
                form.reset();
                
                // Reset form labels
                const formInputs = form.querySelectorAll('.form-input');
                formInputs.forEach(input => {
                    input.placeholder = input.placeholder;
                });
            }
        });
    }
}

// Form validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: block;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
}

function showSuccessMessage(message) {
    const form = document.getElementById('contactForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            border: 1px solid rgba(34, 197, 94, 0.2);
            text-align: center;
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            ${message}
        </div>
    `;
    
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .team-card, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', debounce(function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10));
    }
}

// Particles Animation
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 8000);
        }
        
        // Create particles periodically
        setInterval(createParticle, 300);
        
        // Create initial particles
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 100);
        }
    }
}

// CTA Button Handlers
function initCTAButtons() {
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('btn-primary')) {
                // Primary button - scroll to contact
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = contactSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus on first form field
                    setTimeout(() => {
                        const nameField = document.getElementById('name');
                        if (nameField) {
                            nameField.focus();
                        }
                    }, 800);
                }
            } else if (this.classList.contains('btn-secondary')) {
                // Secondary button - scroll to about
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = aboutSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide scroll indicator when scrolling
        window.addEventListener('scroll', debounce(function() {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }, 10));
    }
}

// Utility Functions
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

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('scroll', debounce(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroContent.style.transform = `translateY(${rate}px)`;
        }, 10));
    }
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Performance Optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update any frame-based animations here
    ticking = false;
}

window.addEventListener('scroll', requestTick);

// Smooth scroll fallback for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    function smoothScrollTo(target) {
        const start = window.pageYOffset;
        const distance = target - start;
        const duration = 800;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Override scroll behavior
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(options) {
        if (typeof options === 'object' && options.behavior === 'smooth') {
            smoothScrollTo(options.top);
        } else {
            originalScrollTo.apply(window, arguments);
        }
    };
}

// Loading Animation
function initLoadingAnimation() {
    const body = document.body;
    
    // Add loading class
    body.classList.add('loading');
    
    // Remove loading class after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            body.classList.remove('loading');
        }, 500);
    });
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading {
            overflow: hidden;
        }
        
        .loading * {
            animation-play-state: paused !important;
        }
        
        .loading .hero-content {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        body:not(.loading) .hero-content {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(loadingStyles);
}

// Initialize loading animation
initLoadingAnimation();

// Add intersection observer for better performance
const intersectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '50px'
    }
);

// Observe all sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        intersectionObserver.observe(section);
    });
});

// Add styles for in-view animation
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    section.in-view {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);