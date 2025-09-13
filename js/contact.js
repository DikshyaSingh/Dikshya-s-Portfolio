// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    initContactAnimations();
    initFormValidation();
});

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    const submitButton = form.querySelector('.form-submit');

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        const originalText = submitButton.querySelector('.btn-text').textContent;
        const originalIcon = submitButton.querySelector('.btn-icon').className;
        
        submitButton.querySelector('.btn-text').textContent = 'Sending...';
        submitButton.querySelector('.btn-icon').className = 'fas fa-spinner fa-spin';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            await simulateFormSubmission(new FormData(form));
            showSuccessMessage();
            form.reset();
            resetFormStyles();
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            // Reset button state
            submitButton.querySelector('.btn-text').textContent = originalText;
            submitButton.querySelector('.btn-icon').className = originalIcon;
            submitButton.disabled = false;
        }
    });

    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        input.addEventListener('input', () => {
            validateField(input);
        });
    });
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('contact-form');
    
    // Real-time validation
    form.addEventListener('input', (e) => {
        if (e.target.matches('.form-input, .form-textarea')) {
            validateField(e.target);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    removeFieldError(field);

    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Subject is required';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters';
            }
            break;

        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }

    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('.form-input, .form-textarea');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    setTimeout(() => {
        errorElement.style.opacity = '1';
    }, 10);
}

function showFieldSuccess(field) {
    field.classList.add('success');
    field.classList.remove('error');
    removeFieldError(field);
}

function removeFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }
}

function resetFormStyles() {
    const fields = document.querySelectorAll('.form-input, .form-textarea');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
        field.parentElement.classList.remove('focused');
        removeFieldError(field);
    });
}

// Simulate form submission
async function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate
                resolve({ success: true });
            } else {
                reject(new Error('Network error. Please try again.'));
            }
        }, 2000);
    });
}

// Success/Error messages
function showSuccessMessage() {
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Contact animations
function initContactAnimations() {
    // Animate contact cards on scroll
    const contactCards = document.querySelectorAll('.contact-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    contactCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });

    // Animate form elements
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateX(-30px)';
        group.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateX(0)';
        }, index * 100 + 500);
    });

    // Animate social links
    const socialLinks = document.querySelectorAll('.social-link-large');
    
    socialLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Character counter for textarea
function initCharacterCounter() {
    const textarea = document.querySelector('#message');
    const maxLength = 500;
    
    if (textarea) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--gray);
            margin-top: 0.5rem;
        `;
        
        textarea.parentElement.appendChild(counter);
        
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.style.color = '#e74c3c';
            } else if (remaining < 100) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = 'var(--gray)';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        textarea.setAttribute('maxlength', maxLength);
        updateCounter();
    }
}

// Auto-resize textarea
function initAutoResizeTextarea() {
    const textarea = document.querySelector('#message');
    
    if (textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initCharacterCounter();
    initAutoResizeTextarea();
});

// Copy contact info to clipboard
function initCopyToClipboard() {
    const contactTexts = document.querySelectorAll('.contact-text');
    
    contactTexts.forEach(text => {
        text.style.cursor = 'pointer';
        text.title = 'Click to copy';
        
        text.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(text.textContent);
                showNotification('Copied to clipboard!', 'success');
                
                // Visual feedback
                const originalColor = text.style.color;
                text.style.color = 'var(--primary-color)';
                setTimeout(() => {
                    text.style.color = originalColor;
                }, 300);
            } catch (err) {
                console.error('Failed to copy: ', err);
                showNotification('Failed to copy to clipboard', 'error');
            }
        });
    });
}

// Initialize copy functionality
document.addEventListener('DOMContentLoaded', initCopyToClipboard);

// Export functions for external use
window.contactUtils = {
    initContactForm,
    initFAQ,
    initContactAnimations,
    showNotification,
    validateForm
};