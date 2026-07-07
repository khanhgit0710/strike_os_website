// Animate numbers and progress bars on scroll for benchmark cards
const benchmarkObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            
            // Animate progress bar width
            const progress = card.querySelector('.progress-fill');
            if (progress && progress.dataset.width) {
                progress.style.width = progress.dataset.width;
            }
            
            // Animate number count up
            const numberEl = card.querySelector('.new-fps');
            if (numberEl && numberEl.dataset.target) {
                const target = parseInt(numberEl.dataset.target, 10);
                let current = 0;
                const increment = Math.ceil(target / 40); // speed
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    numberEl.textContent = current;
                }, 30);
            }
            
            observer.unobserve(card); // Only animate once
        }
    });
};

const benchmarkObserver = new IntersectionObserver(benchmarkObserverCallback, { threshold: 0.2 });

document.querySelectorAll('.new-bm-card').forEach(card => {
    benchmarkObserver.observe(card);
});

// Auto-scroll for feedback slider
const slider = document.getElementById('feedback-slider');
let isHovered = false;

if (slider) {
    const items = Array.from(slider.children);
    // The gap defined in CSS is 30px
    const gap = 30; 
    
    // Total width to scroll before we loop back
    // It is the original scrollWidth plus the gap that will connect to the first clone
    const originalScrollWidth = slider.scrollWidth + gap;

    // Clone all items for infinite scrolling
    items.forEach(item => {
        const clone = item.cloneNode(true);
        slider.appendChild(clone);
    });

    slider.addEventListener('mouseenter', () => isHovered = true);
    slider.addEventListener('mouseleave', () => isHovered = false);
    
    // Pause auto-scroll on touch/swipe
    slider.addEventListener('touchstart', () => isHovered = true, {passive: true});
    slider.addEventListener('touchend', () => {
        setTimeout(() => isHovered = false, 1000); // Resume shortly after touch ends
    }, {passive: true});
    
    let scrollSpeed = 0.8;
    let scrollAccumulator = 0;

    const autoScroll = () => {
        if (!isHovered && slider.scrollWidth > slider.clientWidth) {
            scrollAccumulator += scrollSpeed;
            if (scrollAccumulator >= 1) {
                slider.scrollLeft += Math.floor(scrollAccumulator);
                scrollAccumulator -= Math.floor(scrollAccumulator);
            }
            
            // Seamless infinite loop
            if (slider.scrollLeft >= originalScrollWidth) {
                slider.scrollLeft -= originalScrollWidth;
            }
        }
        requestAnimationFrame(autoScroll);
    };
    
    requestAnimationFrame(autoScroll);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 30,
                behavior: 'smooth'
            });
        }
    });
});

// 3D Slider logic
const slider3dItems = document.querySelectorAll('.slider-item');
const slider3dLogos = document.querySelectorAll('.slider-logo');
let current3dIndex = 0;
const total3dItems = slider3dItems.length;

function update3dSlider(newIndex) {
    if(total3dItems === 0) return;
    
    // Remove all classes
    slider3dItems.forEach(item => {
        item.classList.remove('active', 'prev', 'next', 'hidden');
    });
    slider3dLogos.forEach(logo => {
        logo.classList.remove('active');
    });

    current3dIndex = newIndex;
    
    // Add new classes
    const prevIndex = (current3dIndex - 1 + total3dItems) % total3dItems;
    const nextIndex = (current3dIndex + 1) % total3dItems;

    slider3dItems.forEach((item, index) => {
        if (index === current3dIndex) {
            item.classList.add('active');
        } else if (index === prevIndex) {
            item.classList.add('prev');
        } else if (index === nextIndex) {
            item.classList.add('next');
        } else {
            item.classList.add('hidden');
        }
    });

    slider3dLogos[current3dIndex].classList.add('active');
}

if(total3dItems > 0) {
    // Auto play
    let slider3dInterval = setInterval(() => {
        update3dSlider((current3dIndex + 1) % total3dItems);
    }, 4000);

    // Click events
    slider3dItems.forEach((item) => {
        item.addEventListener('click', () => {
            clearInterval(slider3dInterval);
            const index = parseInt(item.getAttribute('data-index'));
            update3dSlider(index);
            slider3dInterval = setInterval(() => {
                update3dSlider((current3dIndex + 1) % total3dItems);
            }, 4000);
        });
    });

    slider3dLogos.forEach((logo) => {
        logo.addEventListener('click', () => {
            clearInterval(slider3dInterval);
            const index = parseInt(logo.getAttribute('data-index'));
            update3dSlider(index);
            slider3dInterval = setInterval(() => {
                update3dSlider((current3dIndex + 1) % total3dItems);
            }, 4000);
        });
    });

    const btnPrev = document.querySelector('.slider-nav-btn.btn-prev');
    const btnNext = document.querySelector('.slider-nav-btn.btn-next');

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            clearInterval(slider3dInterval);
            update3dSlider((current3dIndex - 1 + total3dItems) % total3dItems);
            slider3dInterval = setInterval(() => {
                update3dSlider((current3dIndex + 1) % total3dItems);
            }, 4000);
        });

        btnNext.addEventListener('click', () => {
            clearInterval(slider3dInterval);
            update3dSlider((current3dIndex + 1) % total3dItems);
            slider3dInterval = setInterval(() => {
                update3dSlider((current3dIndex + 1) % total3dItems);
            }, 4000);
        });
    }
}

// Hero Section Image Slider
const heroSlides = document.querySelectorAll('.hero-3d-slider .slide-img');
if (heroSlides.length > 0) {
    let currentHeroSlide = 0;
    const totalHeroSlides = heroSlides.length;

    function updateHeroSlider() {
        heroSlides.forEach(item => {
            item.classList.remove('active', 'prev', 'next', 'hidden', 'exit');
        });

        const prevIndex = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
        const nextIndex = (currentHeroSlide + 1) % totalHeroSlides;

        heroSlides.forEach((item, index) => {
            if (index === currentHeroSlide) {
                item.classList.add('active');
            } else if (index === prevIndex) {
                item.classList.add('prev');
            } else if (index === nextIndex) {
                item.classList.add('next');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Initialize
    updateHeroSlider();

    setInterval(() => {
        currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
        updateHeroSlider();
    }, 4000);
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
        }
    });
}, {
    root: null,
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});
