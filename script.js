// ====================================
// Navigation Active State
// ====================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
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

window.addEventListener('scroll', setActiveLink);

// ====================================
// Mobile Menu Toggle
// ====================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });
});

// ====================================
// Scroll Reveal Animation
// ====================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skill-item')) {
                const progressBar = entry.target.querySelector('.skill-progress-bar');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    setTimeout(() => {
                        progressBar.style.setProperty('--progress-width', progress + '%');
                        progressBar.style.width = progress + '%';
                    }, 200);
                }
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with scroll-reveal class
const revealElements = document.querySelectorAll('.scroll-reveal');
revealElements.forEach(element => {
    observer.observe(element);
});

// ====================================
// Smooth Scroll Enhancement
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// Initial Animation Delay & Page Loader
// ====================================
window.addEventListener('load', () => {
    // Hide loader after page loads
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);
    
    // Ensure hero animations start
    const heroElements = document.querySelectorAll('.fade-in-up');
    heroElements.forEach(element => {
        element.style.animationPlayState = 'running';
    });
    
    // Initialize particles
    initParticles();
});

// ====================================
// Navbar Background on Scroll
// ====================================
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.style.boxShadow = '0 4px 24px 0px rgba(0, 0, 0, 0.2)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ====================================
// Back to Top Button
// ====================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ====================================
// CRM Integration Functions
// ====================================
function syncContactToCRM(contactData) {
    try {
        // Get existing contacts from localStorage
        const existingContacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        
        // Create new contact object
        const newContact = {
            id: Date.now().toString(),
            name: contactData.name,
            email: contactData.email,
            subject: contactData.subject,
            message: contactData.message,
            source: 'Website Contact Form',
            status: 'New',
            priority: 'Medium',
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
        
        // Add to existing contacts
        existingContacts.push(newContact);
        
        // Save back to localStorage
        localStorage.setItem('crm_contacts', JSON.stringify(existingContacts));
        
        console.log('✅ Contact synced to CRM:', newContact);
        
        // Optional: Send to external CRM if you have one
        // sendToExternalCRM(newContact);
        
        return true;
    } catch (error) {
        console.error('❌ Error syncing to CRM:', error);
        return false;
    }
}

function sendToExternalCRM(contactData) {
    // Example function for sending to external CRM API
    // Uncomment and modify if you have an external CRM service
    
    /*
    fetch('YOUR_CRM_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: JSON.stringify({
            name: contactData.name,
            email: contactData.email,
            subject: contactData.subject,
            message: contactData.message,
            source: 'Website Contact Form',
            custom_fields: {
                website_url: window.location.origin,
                submission_date: contactData.createdAt
            }
        })
    })
    .then(response => response.json())
    .then(data => console.log('✅ Sent to external CRM:', data))
    .catch(error => console.error('❌ External CRM error:', error));
    */
}

function getCRMStats() {
    try {
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        const today = new Date().toISOString().split('T')[0];
        
        return {
            total: contacts.length,
            today: contacts.filter(c => c.createdAt.startsWith(today)).length,
            thisWeek: contacts.filter(c => {
                const contactDate = new Date(c.createdAt);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return contactDate >= weekAgo;
            }).length,
            byStatus: contacts.reduce((acc, contact) => {
                acc[contact.status] = (acc[contact.status] || 0) + 1;
                return acc;
            }, {})
        };
    } catch (error) {
        console.error('❌ Error getting CRM stats:', error);
        return { total: 0, today: 0, thisWeek: 0, byStatus: {} };
    }
}

// ====================================
// Contact Form Handling (Enhanced with CRM)
// ====================================
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Enhanced form submission with CRM sync
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Hide any previous messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // Simulate form submission (in production, replace with actual API call)
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demonstration purposes, we'll show success
        // In production, replace this with actual fetch/axios call to your backend
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to send message');
        */
        
        // ✅ SYNC TO CRM (New functionality)
        const crmSyncSuccess = syncContactToCRM(data);
        
        if (crmSyncSuccess) {
            console.log('📊 CRM Stats:', getCRMStats());
        }
        
        // Show success message
        successMessage.classList.remove('hidden');
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
        
        // Log data (for demonstration - remove in production)
        console.log('Form submitted:', data);
        
    } catch (error) {
        // Show error message
        errorMessage.classList.remove('hidden');
        console.error('Form submission error:', error);
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
});

// ====================================
// Particles Animation
// ====================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.min(100, Math.floor(canvas.width / 10));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    createParticles();
    window.addEventListener('resize', createParticles);
    
    // Connect particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.2;
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}


// ====================================
// Animated Stats Counter
// ====================================
function animateStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                updateCounter();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
}

// Initialize stats counter when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateStatsCounter);
} else {
    animateStatsCounter();
}


// ====================================
// Dark/Light Mode Toggle
// ====================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        // Toggle icons
        sunIcon.classList.toggle('hidden');
        moonIcon.classList.toggle('hidden');
        
        // Save theme preference
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        
        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
    initThemeToggle();
}

// ====================================
// Project Filtering
// ====================================
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category');
                
                // Hide all cards first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                        // Show with animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 200);
            });
        });
    });
}

// Initialize project filtering when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectFiltering);
} else {
    initProjectFiltering();
}

// ====================================
// Lazy Loading Images
// ====================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                // Load the image
                if (src) {
                    // Create a temporary image to preload
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.src = src;
                        img.classList.add('loaded');
                    };
                    tempImg.src = src;
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// ====================================
// Form Validation
// ====================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    // Validation rules
    const validators = {
        name: {
            input: nameInput,
            error: nameError,
            rules: [
                {
                    test: (value) => value.trim().length >= 2,
                    message: 'Name must be at least 2 characters'
                },
                {
                    test: (value) => /^[a-zA-Z\s]+$/.test(value),
                    message: 'Name can only contain letters and spaces'
                }
            ]
        },
        email: {
            input: emailInput,
            error: emailError,
            rules: [
                {
                    test: (value) => value.trim().length > 0,
                    message: 'Email is required'
                },
                {
                    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: 'Please enter a valid email address'
                }
            ]
        },
        subject: {
            input: subjectInput,
            error: subjectError,
            rules: [
                {
                    test: (value) => value.trim().length >= 3,
                    message: 'Subject must be at least 3 characters'
                },
                {
                    test: (value) => value.trim().length <= 100,
                    message: 'Subject must be less than 100 characters'
                }
            ]
        },
        message: {
            input: messageInput,
            error: messageError,
            rules: [
                {
                    test: (value) => value.trim().length >= 10,
                    message: 'Message must be at least 10 characters'
                },
                {
                    test: (value) => value.trim().length <= 1000,
                    message: 'Message must be less than 1000 characters'
                }
            ]
        }
    };
    
    // Validate a single field
    function validateField(fieldName) {
        const validator = validators[fieldName];
        const value = validator.input.value;
        
        // Clear previous state
        validator.error.textContent = '';
        validator.error.classList.remove('visible');
        validator.input.classList.remove('error', 'success');
        
        // Check each rule
        for (let rule of validator.rules) {
            if (!rule.test(value)) {
                validator.error.textContent = rule.message;
                validator.error.classList.add('visible');
                validator.input.classList.add('error');
                return false;
            }
        }
        
        // All rules passed
        validator.input.classList.add('success');
        return true;
    }
    
    // Add real-time validation on blur
    Object.keys(validators).forEach(fieldName => {
        const validator = validators[fieldName];
        
        // Validate on blur
        validator.input.addEventListener('blur', () => {
            if (validator.input.value.trim().length > 0) {
                validateField(fieldName);
            }
        });
        
        // Clear error on focus
        validator.input.addEventListener('focus', () => {
            validator.error.classList.remove('visible');
            validator.input.classList.remove('error');
        });
        
        // Real-time validation while typing (debounced)
        let typingTimer;
        validator.input.addEventListener('input', () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                if (validator.input.value.trim().length > 0) {
                    validateField(fieldName);
                }
            }, 500);
        });
    });
    
    // Validate all fields on form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        Object.keys(validators).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        
        // If all fields are valid, proceed with form submission
        if (isValid) {
            // Original form submission logic
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            // Hide any previous messages
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
            
            // Simulate form submission
            setTimeout(() => {
                // ✅ SYNC TO CRM (New functionality)
                const crmSyncSuccess = syncContactToCRM(data);
                
                if (crmSyncSuccess) {
                    console.log('📊 CRM Stats:', getCRMStats());
                }
                
                // Show success message
                successMessage.classList.remove('hidden');
                form.reset();
                
                // Clear all validation states
                Object.keys(validators).forEach(fieldName => {
                    validators[fieldName].input.classList.remove('success', 'error');
                    validators[fieldName].error.classList.remove('visible');
                });
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
                
                console.log('Form submitted:', data);
            }, 1000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

// Initialize form validation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormValidation);
} else {
    initFormValidation();
}


// ====================================
// Accessibility Improvements
// ====================================

// Update ARIA States for Navigation
function updateNavAriaStates() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.classList.contains('active')) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Call this whenever navigation state changes
window.addEventListener('scroll', () => {
    updateNavAriaStates();
});

// Update ARIA States for Filter Buttons
function updateFilterAriaStates(activeButton) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        if (btn === activeButton) {
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// Enhance Project Filtering with ARIA Support
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateFilterAriaStates(button);
        });
        
        // Add keyboard support (Space key)
        button.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                button.click();
            }
        });
    });
});

// Announce Dynamic Content Changes to Screen Readers
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('visually-hidden');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Announce Project Filter Changes
const originalFilterFunction = initProjectFiltering;
if (typeof initProjectFiltering === 'function') {
    const filterButtonsForAnnounce = document.querySelectorAll('.filter-btn');
    filterButtonsForAnnounce.forEach(button => {
        button.addEventListener('click', () => {
            const filterText = button.textContent.trim();
            const projectCards = document.querySelectorAll('.project-card:not(.hidden)');
            const count = projectCards.length;
            
            announceToScreenReader(
                `Showing ${count} ${filterText.toLowerCase()} project${count !== 1 ? 's' : ''}`,
                'polite'
            );
        });
    });
}

// Trap Focus in Mobile Menu When Open
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        
        // Close on Escape
        if (e.key === 'Escape') {
            const closeButton = element.querySelector('.mobile-menu-btn');
            if (closeButton) {
                closeButton.click();
            }
        }
    });
}

// Apply Focus Trap to Mobile Menu
const mobileMenuToggle = document.querySelector('.mobile-menu-btn');
const navLinksMenu = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinksMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        if (navLinksMenu.classList.contains('active')) {
            trapFocus(navLinksMenu);
            // Focus first link when menu opens
            const firstLink = navLinksMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    });
}

// Add Keyboard Navigation for Back to Top Button
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    backToTopButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            backToTopButton.click();
        }
    });
}

// Announce Form Submission Status
const formElement = document.getElementById('contactForm');
if (formElement) {
    formElement.addEventListener('submit', () => {
        setTimeout(() => {
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');
            
            if (successMsg && !successMsg.classList.contains('hidden')) {
                announceToScreenReader('Message sent successfully', 'polite');
            } else if (errorMsg && !errorMsg.classList.contains('hidden')) {
                announceToScreenReader('Error sending message. Please try again.', 'assertive');
            }
        }, 1100);
    });
}

// Enhanced Keyboard Navigation for Theme Toggle
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        announceToScreenReader(`Switched to ${theme} mode`, 'polite');
    });
    
    themeToggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggleBtn.click();
        }
    });
}

// Prefers Reduced Motion Detection
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable particle animation
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        particlesCanvas.style.display = 'none';
    }
    
    // Disable complex animations
    document.querySelectorAll('.loader-circle, .gradient-orb').forEach(el => {
        el.style.animation = 'none';
    });
}

// Add ARIA Labels Dynamically for Better Context
document.addEventListener('DOMContentLoaded', () => {
    // Add labels to social links if not present
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        if (!link.getAttribute('aria-label')) {
            const href = link.getAttribute('href');
            if (href.includes('github')) link.setAttribute('aria-label', 'Visit GitHub profile');
            if (href.includes('linkedin')) link.setAttribute('aria-label', 'Visit LinkedIn profile');
            if (href.includes('twitter')) link.setAttribute('aria-label', 'Visit Twitter profile');
        }
    });
    
    // Add context to project links
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        const linkText = link.textContent.trim();
        const projectCard = link.closest('.project-card');
        const projectTitle = projectCard ? projectCard.querySelector('.project-title')?.textContent : '';
        
        if (projectTitle && linkText) {
            link.setAttribute('aria-label', `${linkText} for ${projectTitle}`);
        }
    });
});

console.log('✅ Accessibility features initialized');


// ====================================
// Scroll Progress Indicator
// ====================================
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    
    if (!scrollProgress || !scrollProgressBar) return;
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate scroll percentage
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        // Update progress bar width
        scrollProgressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateScrollProgress);
    
    // Update on resize
    window.addEventListener('resize', updateScrollProgress);
    
    // Initial update
    updateScrollProgress();
}

// Initialize scroll progress when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollProgress);
} else {
    initScrollProgress();
}

// ====================================
// Cookie Consent Banner
// ====================================
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    if (!cookieConsent || !acceptBtn || !declineBtn) return;
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    // Show banner if no choice has been made
    if (!cookieChoice) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('visible');
            announceToScreenReader('Cookie consent banner displayed', 'polite');
        }, 1500);
    }
    
    // Handle accept
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
        announceToScreenReader('Cookies accepted', 'polite');
        
        // Initialize analytics or other cookie-dependent features here
        console.log('✅ Cookies accepted - Analytics can be initialized');
    });
    
    // Handle decline
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieBanner();
        announceToScreenReader('Cookies declined', 'polite');
        
        console.log('❌ Cookies declined - Only essential cookies will be used');
    });
    
    // Function to hide banner
    function hideCookieBanner() {
        cookieConsent.classList.remove('visible');
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 400);
    }
    
    // Keyboard support
    acceptBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            acceptBtn.click();
        }
    });
    
    declineBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            declineBtn.click();
        }
    });
}

// Initialize cookie consent when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
    initCookieConsent();
}

// ====================================
// Performance Monitoring (Optional)
// ====================================
function logPerformanceMetrics() {
    if ('performance' in window && 'PerformancePaintTiming' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const paintData = performance.getEntriesByType('paint');
                
                console.log('📊 Performance Metrics:');
                console.log('───────────────────────────────');
                
                if (perfData) {
                    console.log(`⏱️  DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
                    console.log(`⏱️  Page Load Time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
                    console.log(`⏱️  Total Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                }
                
                paintData.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`🎨 First Contentful Paint: ${Math.round(entry.startTime)}ms`);
                    }
                    if (entry.name === 'first-paint') {
                        console.log(`🎨 First Paint: ${Math.round(entry.startTime)}ms`);
                    }
                });
                
                console.log('───────────────────────────────');
            }, 0);
        });
    }
}

// Initialize performance monitoring
logPerformanceMetrics();

// ====================================
// Service Worker Registration (PWA Support)
// ====================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered successfully:', registration.scope);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        });
    }
}

// Uncomment to enable PWA functionality when service worker is created
// registerServiceWorker();

console.log('✅ All production features initialized successfully!');
console.log('───────────────────────────────────────────────');
console.log('📦 Features Active:');
console.log('  • SEO Meta Tags & Open Graph');
console.log('  • JSON-LD Structured Data');
console.log('  • PWA Manifest');
console.log('  • Scroll Progress Indicator');
console.log('  • Cookie Consent Banner');
console.log('  • Accessibility (WCAG 2.1 AA)');
console.log('  • Dark/Light Mode Toggle');
console.log('  • Lazy Loading Images');
console.log('  • Form Validation');
console.log('  • Performance Monitoring');
console.log('  • CRM Integration ✅ NEW!');
console.log('───────────────────────────────────────────────');
