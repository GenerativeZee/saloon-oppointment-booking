document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Fade-up Animation Observer
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    /* ==========================================================================
       Testimonial Carousel
       ========================================================================== */
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        slides[currentSlide].classList.add('active');
    }

    nextBtn.addEventListener('click', () => {
        currentSlide++;
        showSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide--;
        showSlide(currentSlide);
    });

    // Auto-advance carousel
    setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 5000);

    /* ==========================================================================
       Booking Modal & Wizard Logic
       ========================================================================== */
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.open-booking');
    const closeBtn = document.querySelector('.close-modal');
    const doneBtn = document.querySelector('.close-modal-btn');
    
    // Open Modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            resetWizard();
        });
    });

    // Close Modal function
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    /* --- Wizard State --- */
    let currentStep = 1;
    const totalSteps = 3;
    let bookingData = {
        service: null,
        stylist: null,
        date: null,
        time: null,
        name: null,
        email: null
    };

    const nextBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const submitBtn = document.querySelector('.submit-booking');

    // Make selectOption available globally
    window.selectOption = function(element, type) {
        // Remove selected class from siblings
        const siblings = element.parentElement.children;
        for (let sib of siblings) {
            sib.classList.remove('selected');
        }
        // Add selected class to clicked
        element.classList.add('selected');
        
        // Update data
        bookingData[type] = element.innerText;

        // Enable next button for current step
        const stepContainer = element.closest('.wizard-step');
        const nxtBtn = stepContainer.querySelector('.next-step');
        if (nxtBtn) nxtBtn.disabled = false;
    };

    function updateWizard() {
        // Update Step content
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step-${currentStep}`).classList.add('active');

        // Update Progress Bar
        document.querySelectorAll('.progress-bar .step').forEach(indicator => {
            const stepNum = parseInt(indicator.getAttribute('data-step'));
            indicator.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < currentStep) {
                indicator.classList.add('completed');
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateWizard();
            }
        });
    });

    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizard();
            }
        });
    });

    submitBtn.addEventListener('click', () => {
        // Simple validation
        const date = document.getElementById('book-date').value;
        const time = document.getElementById('book-time').value;
        const name = document.getElementById('book-name').value;
        const email = document.getElementById('book-email').value;

        if (!date || !time || !name || !email) {
            alert('Please fill out all fields.');
            return;
        }

        // Normally we would send data to a backend here.
        // For this demo, we just show success screen.
        
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step-success').classList.add('active');
        
        // Hide progress bar on success
        document.querySelector('.progress-bar').style.display = 'none';
        document.querySelector('.wizard-header h2').innerText = 'Thank You';
    });

    function resetWizard() {
        currentStep = 1;
        bookingData = {};
        
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.disabled = true;
        });

        document.getElementById('book-date').value = '';
        document.getElementById('book-time').value = '';
        document.getElementById('book-name').value = '';
        document.getElementById('book-email').value = '';

        document.querySelector('.progress-bar').style.display = 'flex';
        document.querySelector('.wizard-header h2').innerText = 'Book Appointment';
        
        updateWizard();
    }
});
