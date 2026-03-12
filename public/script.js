// ===================================
// Loading Screen Animation with Video
// ===================================
const loadingScreen = document.getElementById('loading-screen');
const loadingVideo = document.getElementById('loading-video');

function initLoadingScreen() {
    // Disable loading screen completely on mobile devices
    if (window.innerWidth <= 768) {
        if (loadingScreen) loadingScreen.style.display = 'none';
        document.body.classList.remove('loading');
        if (loadingVideo) {
            loadingVideo.pause();
            loadingVideo.removeAttribute('src'); // Free up memory
            loadingVideo.load();
        }
        return;
    }

    // Video event handling
    if (loadingVideo) {
        // Fallback: If video fails to load, continue with black background
        loadingVideo.addEventListener('error', () => {
            console.warn('Loading video failed to load. Using fallback black background.');
        });

        // Pause video when it ends to save resources
        loadingVideo.addEventListener('ended', () => {
            loadingVideo.pause();
        });
    }

    // Timeline:
    // 0-90ms: Black background fade-in (handled by CSS animation)
    // 90-2310ms: Video plays (2.22 seconds = 2220ms)
    // 2310-2400ms: Black background fade-out (90ms)
    // 2400ms: Loading screen removed

    // Stage 1: Fade-out starts at 2310ms
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        document.body.classList.remove('loading');
    }, 2310);

    // Stage 2: Remove loading screen from DOM at 2400ms
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            // Pause and reset video to save resources
            if (loadingVideo) {
                loadingVideo.pause();
                loadingVideo.currentTime = 0;
            }
        }
    }, 2400);
}

// Initialize loading screen on page load
if (loadingScreen) {
    initLoadingScreen();
}

// ===================================
// Navbar scroll effect
// ===================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
// Force scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobilePanelClose = document.getElementById('mobilePanelClose');
let scrollPosition = 0;

function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);

    // Close all open dropdowns too
    document.querySelectorAll('.dropdown.mobile-open').forEach(d => d.classList.remove('mobile-open'));
}

function openMobileMenu() {
    scrollPosition = window.scrollY;
    navMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add('no-scroll');
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
}

// Panel close button (×)
if (mobilePanelClose) {
    mobilePanelClose.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking the dark overlay
if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
}

// Tap-to-expand dropdowns on mobile
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    if (!link) return;

    link.addEventListener('click', (e) => {
        // Only intercept on mobile
        if (window.innerWidth > 768) return;

        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdown.classList.contains('mobile-open');

        // Close all others first
        document.querySelectorAll('.dropdown.mobile-open').forEach(d => d.classList.remove('mobile-open'));

        // Toggle this one
        if (!isOpen) {
            dropdown.classList.add('mobile-open');
        }
    });
});

// Close mobile menu when clicking a non-dropdown nav-link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Skip if this is a dropdown toggle (handled above)
        if (link.closest('.dropdown')) return;
        if (!navMenu.classList.contains('active')) return;

        e.preventDefault();
        e.stopPropagation();

        const href = link.getAttribute('href');
        closeMobileMenu();

        setTimeout(() => {
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (href.includes('.html')) {
                    window.location.href = href; // External page (gallery.html)
                }
            }
        }, 60);
    });
});

// Close mobile menu when clicking dropdown sub-links
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;
        // Let default onclick fire first, then close the menu
        setTimeout(closeMobileMenu, 100);
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Get the submit button to change its state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formMessage.textContent = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                formMessage.textContent = 'Thank you for your enquiry! We will contact you soon.';
                formMessage.style.color = '#1E5AAC'; // Ao blue
                formMessage.style.marginTop = '1rem';
                formMessage.style.textAlign = 'center';

                // Reset form
                contactForm.reset();
            } else {
                // Handle potential errors from Formspree
                const errorData = await response.json();
                if (Object.hasOwn(errorData, 'errors')) {
                    const errorMessages = errorData.errors.map(error => error.message).join(", ");
                    throw new Error(errorMessages);
                } else {
                    throw new Error('Oops! There was a problem submitting your form');
                }
            }
        } catch (error) {
            // Show error message
            formMessage.textContent = error.message || 'Oops! Something went wrong. Please try again.';
            formMessage.style.color = '#ef4444'; // Red color
            formMessage.style.marginTop = '1rem';
            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        }
    });
}

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// GSAP Scroll-Triggered Text Reveal Animation
// Register ScrollTrigger plugin
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Apply to all elements with js-fill class
    const fillElements = document.querySelectorAll('.js-fill > span');

    fillElements.forEach(target => {
        if (target && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.to(target, {
                backgroundPosition: '0% 0',  // Move gradient from right (100%) to left (0%)
                ease: 'none',
                scrollTrigger: {
                    trigger: target.closest('.js-fill'),
                    start: 'top 75%',        // Start when element enters viewport
                    end: 'top 40%',          // Complete quickly for full text visibility
                    scrub: 0.5,              // Smooth scrolling effect
                }
            });
        }
    });
}

// Bento Grid Scroll Animations
const bentoObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            bentoObserver.unobserve(entry.target);
        }
    });
}, bentoObserverOptions);

// Observe all Bento cards
document.querySelectorAll('[data-aos]').forEach(card => {
    bentoObserver.observe(card);
});

/* ===================================
   Modal Logic
   =================================== */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('programModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalTrigger = document.querySelector('.close-modal-trigger');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    const programDetails = {
        monthly: {
            title: 'Monthly Plan',
            content: `
                <p>Full access to our comprehensive Karate training program on a flexible month-to-month billing cycle. Ideal for students starting their martial arts journey without long-term commitments.</p>
                <ul>
                    <li><strong>Training Access:</strong> All scheduled classes applicable to belt level.</li>
                    <li><strong>Focus:</strong> From fundamental stances to advanced Shito-Ryu forms and sparring strategies.</li>
                    <li><strong>Benefits:</strong> Top-tier physical conditioning, self-defense mastery, and step-by-step belt progression.</li>
                    <li><strong>Billing:</strong> Renews automatically every month. Cancel anytime.</li>
                </ul>
                <p>Start mastering your mind and body under expert guidance with ultimate flexibility.</p>
            `
        },
        yearly: {
            title: 'Annual Plan (Best Value)',
            content: `
                <p>Commit to a year of excellence and get our absolute best value. The Annual Plan includes everything from the Monthly Plan at a significantly discounted rate.</p>
                <ul>
                    <li><strong>Training Access:</strong> Unrestricted access to all scheduled classes year-round.</li>
                    <li><strong>Focus:</strong> Long-term development, including competition preparation and the Black Belt pathway.</li>
                    <li><strong>Benefits:</strong> Consistent growth, deep mentorship opportunities, and the best financial value.</li>
                    <li><strong>Billing:</strong> One upfront payment covering 12 full months.</li>
                </ul>
                <p>Dedicate yourself to true mastery and lock in our lowest rate for your martial arts journey.</p>
            `
        }
    };

    function openModal(programKey) {
        const data = programDetails[programKey];
        if (data && modal) {
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.content;
            modal.style.display = 'flex';
            // Trigger reflow
            void modal.offsetWidth;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    if (openModalBtns) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                const programKey = btn.getAttribute('data-program');
                openModal(programKey);
            });
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (closeModalTrigger) {
        closeModalTrigger.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Expose functions to global scope for inline handlers
    window.closeModal = closeModal;
    window.openModal = openModal;
    window.openCertificateModal = openCertificateModal;

    const certificatesData = {
        '2025-2026': ['January']
    };

    function openCertificateModal(year) {
        if (!modal) return;

        const months = certificatesData[year];
        if (!months) return;

        modalTitle.textContent = `Certificates: ${year}`;

        // Build the month selection UI
        let htmlContent = `<div class="certificate-months-grid">`;
        months.forEach(month => {
            htmlContent += `<button class="btn btn-outline month-btn" onclick="showCertificates('${year}', '${month}')">${month}</button>`;
        });
        htmlContent += `</div><div id="certificate-display-area" class="certificate-display-area"></div>`;

        modalBody.innerHTML = htmlContent;
        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    window.showCertificates = function (year, month) {
        const displayArea = document.getElementById('certificate-display-area');
        if (!displayArea) return;

        // Placeholder for uploaded certificates
        // In a real app, this would fetch images from a server/folder
        displayArea.innerHTML = `
            <h3 class="text-center" style="margin: 2rem 0 1rem; color: var(--color-accent);">${month} ${year}</h3>
            <div class="certificates-gallery">
                <div class="certificate-placeholder">
                    <span>Certificate 1</span>
                </div>
                <div class="certificate-placeholder">
                    <span>Certificate 2</span>
                </div>
                <div class="certificate-placeholder">
                    <span>Certificate 3</span>
                </div>
            </div>
            <p class="text-center" style="margin-top: 1rem; font-size: 0.9rem; color: var(--color-text-muted);">
                (Certificates uploaded by the team will appear here)
            </p>
        `;
    };

    /* --- Certificate / Gallery Lightbox Modal --- */
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalDesc = document.getElementById('cert-modal-desc');
    const certModalClose = document.querySelector('.cert-modal-close');
    const certModalOverlay = document.querySelector('.cert-modal-overlay');

    if (certModal) {
        // Add click listeners to all gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.cursor = 'pointer'; // Make them look clickable

            // Add a subtle hover effect if desired, or rely on CSS
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3');
                const desc = item.querySelector('p');

                if (img) {
                    certModalImg.src = img.src;
                } else {
                    // Fallback for placeholders without real images
                    const placeholderSpan = item.querySelector('.gallery-image span');
                    if (placeholderSpan) {
                        // Empty src will show alt text or broken image icon. 
                        // For this MVP, we just use empty src if no image.
                        certModalImg.src = '';
                        certModalImg.alt = placeholderSpan.textContent;
                    }
                }

                if (title) certModalTitle.textContent = title.textContent;
                if (desc) certModalDesc.textContent = desc.textContent;

                certModal.classList.add('active');
                certModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            });
        });

        // Close functions
        const closeCertModal = () => {
            certModal.classList.remove('active');
            certModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scrolling

            // Clear image after fade Out animation completes (300ms)
            setTimeout(() => {
                certModalImg.src = '';
                certModalImg.alt = 'Certificate View';
            }, 300);
        };

        if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
        if (certModalOverlay) certModalOverlay.addEventListener('click', closeCertModal);

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeCertModal();
            }
        });
    }

});

/* ===================================
   Testimonial Carousel Logic
   =================================== */
function initTestimonialCarousel({ containerSelector, reviews }) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const track = container.querySelector('.testimonial-carousel__track');
    const dotsContainer = container.querySelector('.testimonial-carousel__dots');
    const prevBtn = container.querySelector('.testimonial-carousel__button--prev');
    const nextBtn = container.querySelector('.testimonial-carousel__button--next');

    if (!track || !reviews || reviews.length === 0) return;

    // Build the cards and dots
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    reviews.forEach((review, index) => {
        // Create Card
        const card = document.createElement('article');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-card__quote-icon">"</div>
            <p class="testimonial-card__text">${review.text}</p>
            <p class="testimonial-card__author">&mdash; ${review.author}</p>
        `;
        track.appendChild(card);

        // Create Dot
        const dot = document.createElement('button');
        dot.className = 'testimonial-carousel__dot';
        if (index === 0) dot.classList.add('testimonial-carousel__dot--active');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);

        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    let activeIndex = 0;
    const totalSlides = reviews.length;
    let autoSlideInterval;

    function goToSlide(index) {
        if (index < 0) {
            activeIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            activeIndex = 0;
        } else {
            activeIndex = index;
        }

        // Move the track
        track.style.transform = `translateX(-${activeIndex * 100}%)`;

        // Update dots
        const allDots = dotsContainer.querySelectorAll('.testimonial-carousel__dot');
        allDots.forEach((dot, i) => {
            if (i === activeIndex) {
                dot.classList.add('testimonial-carousel__dot--active');
            } else {
                dot.classList.remove('testimonial-carousel__dot--active');
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(activeIndex - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(activeIndex + 1);
            resetAutoSlide();
        });
    }

    // Auto-slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(activeIndex + 1);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Pause on hover/focus
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
    container.addEventListener('focusin', stopAutoSlide);
    container.addEventListener('focusout', startAutoSlide);

    // Initial Start
    startAutoSlide();
}

// Initialize on page load with data
document.addEventListener('DOMContentLoaded', () => {
    const reviewsData = [
        {
            text: "This club completely changed how my son approaches challenges. His discipline and focus have skyrocketed since joining.",
            author: "Priya Sharma"
        },
        {
            text: "Master Neeraj is fantastic! A perfect blend of traditional respect and modern, engaging training methods. Highly recommended.",
            author: "Rahul Varma"
        },
        {
            text: "I joined for fitness but stayed for the incredible community and self-defense skills. Best decision I've made this year.",
            author: "Anjali Desai"
        },
        {
            text: "The safe, welcoming environment makes all the difference. My kids actually look forward to every single session.",
            author: "Michael T."
        }
    ];

    initTestimonialCarousel({
        containerSelector: '#my-testimonials',
        reviews: reviewsData
    });
});
