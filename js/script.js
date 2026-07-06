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
    slider.addEventListener('mouseenter', () => isHovered = true);
    slider.addEventListener('mouseleave', () => isHovered = false);
    
    setInterval(() => {
        if (!isHovered) {
            slider.scrollBy({ left: 2, behavior: 'auto' });
            if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth - 5)) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }
    }, 30);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
