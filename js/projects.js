// Projects page functionality
document.addEventListener('DOMContentLoaded', function() {
    initProjectFilter();
    initProjectAnimations();
    initProjectSearch();
    initProjectModal();
});

// Project filtering functionality
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show card with animation
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('animate-scale');
                        card.classList.add('animated');
                    }, 100);
                } else {
                    // Hide card with animation
                    card.classList.remove('animate-scale');
                    card.classList.remove('animated');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            // Update project count
            updateProjectCount(filterValue);
        });
    });
}

// Update project count display
function updateProjectCount(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
            visibleCount++;
        }
    });

    // Create or update count display
    let countDisplay = document.querySelector('.project-count');
    if (!countDisplay) {
        countDisplay = document.createElement('div');
        countDisplay.className = 'project-count';
        countDisplay.style.cssText = `
            text-align: center;
            margin: 2rem 0;
            font-size: 1.1rem;
            color: var(--gray);
        `;
        document.querySelector('.projects-grid').parentNode.insertBefore(
            countDisplay, 
            document.querySelector('.projects-grid')
        );
    }

    countDisplay.textContent = `Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;
}

// Project animations
function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');

    // Staggered animation on page load
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Hover effects
    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        const image = card.querySelector('.project-image img');
        const links = card.querySelectorAll('.project-link');

        card.addEventListener('mouseenter', () => {
            // Scale image
            if (image) {
                image.style.transform = 'scale(1.1)';
            }

            // Animate links
            links.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'scale(1) translateY(0)';
                    link.style.opacity = '1';
                }, index * 100);
            });
        });

        card.addEventListener('mouseleave', () => {
            // Reset image
            if (image) {
                image.style.transform = 'scale(1)';
            }

            // Reset links
            links.forEach(link => {
                link.style.transform = 'scale(0.8) translateY(10px)';
                link.style.opacity = '0';
            });
        });

        // Initialize link styles
        links.forEach(link => {
            link.style.transform = 'scale(0.8) translateY(10px)';
            link.style.opacity = '0';
            link.style.transition = 'all 0.3s ease';
        });
    });
}

// Project search functionality
function initProjectSearch() {
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'project-search';
    searchContainer.style.cssText = `
        text-align: center;
        margin: 2rem 0;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 1rem 1.5rem;
        border: 2px solid rgba(255, 107, 157, 0.2);
        border-radius: 50px;
        font-size: 1rem;
        width: 300px;
        max-width: 100%;
        transition: all 0.3s ease;
        background: white;
    `;

    searchContainer.appendChild(searchInput);
    
    // Insert search after filter buttons
    const filterSection = document.querySelector('.project-filter');
    filterSection.parentNode.insertBefore(searchContainer, filterSection.nextSibling);

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase());

            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) ||
                          techTags.some(tag => tag.includes(searchTerm));

            if (matches) {
                card.style.display = 'block';
                card.classList.add('search-match');
            } else {
                card.style.display = 'none';
                card.classList.remove('search-match');
            }
        });

        // Update count for search results
        const visibleCards = document.querySelectorAll('.project-card[style*="block"]').length;
        updateSearchCount(visibleCards, searchTerm);
    });

    // Focus effects
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = 'var(--primary-color)';
        searchInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 157, 0.1)';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'rgba(255, 107, 157, 0.2)';
        searchInput.style.boxShadow = 'none';
    });
}

// Update search count
function updateSearchCount(count, searchTerm) {
    let searchCount = document.querySelector('.search-count');
    if (!searchCount) {
        searchCount = document.createElement('div');
        searchCount.className = 'search-count';
        searchCount.style.cssText = `
            text-align: center;
            margin: 1rem 0;
            font-size: 1rem;
            color: var(--gray);
        `;
        document.querySelector('.projects-grid').parentNode.insertBefore(
            searchCount, 
            document.querySelector('.projects-grid')
        );
    }

    if (searchTerm) {
        searchCount.textContent = `Found ${count} project${count !== 1 ? 's' : ''} matching "${searchTerm}"`;
        searchCount.style.display = 'block';
    } else {
        searchCount.style.display = 'none';
    }
}

// Project modal functionality
function initProjectModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="project-modal" id="project-modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="" alt="">
                    </div>
                    <div class="modal-info">
                        <h2 class="modal-title"></h2>
                        <p class="modal-description"></p>
                        <div class="modal-tech"></div>
                        <div class="modal-links">
                            <a href="#" class="btn btn-primary modal-demo">
                                <i class="fas fa-external-link-alt"></i>
                                Live Demo
                            </a>
                            <a href="#" class="btn btn-secondary modal-github">
                                <i class="fab fa-github"></i>
                                View Code
                            </a>
                        </div>
                        <div class="modal-features">
                            <h3>Key Features</h3>
                            <ul class="features-list"></ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add modal styles
    const modalStyles = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            position: relative;
            background: white;
            border-radius: 1rem;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .project-modal.active .modal-content {
            transform: scale(1);
            opacity: 1;
        }

        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--gray);
            cursor: pointer;
            z-index: 1;
            transition: color 0.3s ease;
        }

        .modal-close:hover {
            color: var(--primary-color);
        }

        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 2rem;
        }

        .modal-image img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 0.5rem;
        }

        .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--dark-gray);
        }

        .modal-description {
            color: var(--gray);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .modal-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .modal-links {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .modal-features h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--dark-gray);
        }

        .features-list {
            list-style: none;
            padding: 0;
        }

        .features-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 107, 157, 0.1);
            color: var(--gray);
        }

        .features-list li:before {
            content: '✓';
            color: var(--primary-color);
            font-weight: bold;
            margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
                gap: 1rem;
                padding: 1rem;
            }
            
            .modal-links {
                flex-direction: column;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    // Modal functionality
    const modal = document.getElementById('project-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');

    // Project data
    const projectData = {
        'E-commerce Platform': {
            features: [
                'User authentication and authorization',
                'Product catalog with search and filters',
                'Shopping cart and checkout process',
                'Payment integration with Stripe',
                'Admin dashboard for inventory management',
                'Responsive design for all devices'
            ]
        },
        'AI Study Assistant': {
            features: [
                'Natural language processing',
                'Intelligent question answering',
                'Study schedule optimization',
                'Progress tracking and analytics',
                'Multi-subject support',
                'Voice interaction capabilities'
            ]
        },
        'Task Management App': {
            features: [
                'Cross-platform compatibility',
                'Real-time synchronization',
                'Team collaboration tools',
                'Priority-based task organization',
                'Deadline reminders and notifications',
                'Offline functionality'
            ]
        }
        // Add more project data as needed
    };

    // Open modal
    function openModal(projectCard) {
        const title = projectCard.querySelector('.project-title').textContent;
        const description = projectCard.querySelector('.project-description').textContent;
        const image = projectCard.querySelector('.project-image img').src;
        const techTags = Array.from(projectCard.querySelectorAll('.tech-tag'));

        // Populate modal content
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-description').textContent = description;
        modal.querySelector('.modal-image img').src = image;

        // Clear and populate tech tags
        const modalTech = modal.querySelector('.modal-tech');
        modalTech.innerHTML = '';
        techTags.forEach(tag => {
            const newTag = tag.cloneNode(true);
            modalTech.appendChild(newTag);
        });

        // Populate features
        const featuresList = modal.querySelector('.features-list');
        featuresList.innerHTML = '';
        const features = projectData[title]?.features || ['Feature information coming soon...'];
        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Event listeners
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Add click listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on links
            if (e.target.closest('.project-link')) return;
            openModal(card);
        });

        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
}

// GitHub contribution graph animation
function initGitHubGraph() {
    const contributionDays = document.querySelectorAll('.contribution-day');
    
    contributionDays.forEach((day, index) => {
        setTimeout(() => {
            day.style.opacity = '1';
            day.style.transform = 'scale(1)';
        }, index * 20);
    });
}

// Initialize GitHub graph if present
if (document.querySelector('.contribution-graph')) {
    initGitHubGraph();
}

// Export functions for external use
window.projectsUtils = {
    initProjectFilter,
    initProjectAnimations,
    initProjectSearch,
    initProjectModal
};