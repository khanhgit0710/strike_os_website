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

// --- I18N Translation System ---
const translations = {
    en: {
        nav_home: "Home",
        nav_performance: "Performance",
        nav_services: "Services",
        nav_feedback: "Feedback",
        btn_discord: "Join Discord",
        hero_h1_line1: "STRIKE OS.<br>",
        hero_h1_line2: "<span class=\"highlight\">TUNED FOR MAXIMUM PERFORMANCE.</span><br>",
        hero_h1_line3: "BUILT FOR EVERYONE.",
        hero_desc: "STRIKE OS is a Custom Windows version built with the goal of delivering maximum performance, high stability, and a smooth experience for gamers, professional users, and anyone looking to maximize their hardware's power.",
        hero_btn_discord: "<i class=\"fa-brands fa-discord\"></i> Join Discord",
        hero_btn_services: "<i class=\"fa-solid fa-server\"></i> Services",
        perf_title: "Performance Benchmark",
        perf_desc: "Real-world performance comparison (Examples)",
        serv_title: "SYSTEM OPTIMIZATION",
        serv_desc: "Engineered to eliminate bottleneck and maximize performance.",
        serv1_sub: "OS OPTIMIZATION",
        serv1_title: "Strike OS - Window Custom",
        serv1_desc: "STRIKE OS is a custom Windows project developed to optimize performance, stability, and user experience.",
        serv1_li1: "Reduce background processes and unnecessary services",
        serv1_li2: "Optimize Registry & Services",
        serv1_li3: "Improve system response time",
        serv1_li4: "Reduce Input Latency",
        serv1_li5: "Optimize CPU, RAM, and GPU",
        serv1_btn: "GET OPTIMIZED",
        serv2_sub: "SYSTEM TUNING",
        serv2_title: "Window Optimization",
        serv2_desc: "Optimize your Windows system for maximum performance",
        serv2_li1: "Select appropriate Drivers and Chipsets for your hardware",
        serv2_li2: "Network Optimization (optimize network & connection stability)",
        serv2_li3: "Input Latency Reduction",
        serv2_li4: "Registry Optimization",
        serv2_li5: "Windows Gaming Optimization Service Fine-tuning",
        serv2_li6: "RAM Usage Optimization",
        serv2_li7: "Disable unnecessary background processes",
        serv2_btn: "GET OPTIMIZED",
        serv3_sub: "HARDWARE",
        serv3_title: "PC Building",
        serv3_desc: "Consulting and building PC configurations tailored to your needs.",
        serv3_li1: "Tailored configuration consulting based on needs and budget (Gaming / Streaming / Design / Work)",
        serv3_li2: "Select genuine components with optimal compatibility between CPU, RAM, GPU, and motherboard",
        serv3_li3: "Professional system assembly with clean and aesthetic cable management",
        serv3_btn: "GET CONSULTATION",
        serv4_sub: "BIOS TUNING",
        serv4_title: "Tuning Bios",
        serv4_desc: "BIOS Optimization",
        serv4_li1: "Optimize EXPO / DOCP, Memory Frequency, and FCLK for both AM4 and AM5",
        serv4_li2: "Fine-tune Precision Boost Overdrive (PBO) and per-core Curve Optimizer Undervolting",
        serv4_li3: "Enable High Bandwidth and Low Latency Support",
        serv4_li4: "Suitable for: AMD Ryzen X3D CPUs (5700X3D / 5800X3D / 7800X3D / 7950X3D / 9850X3D / 9800X3D)",
        serv4_btn: "GET OPTIMIZED",
        fb_title: "Client Feedback",
        fb_desc: "Community Feedback",
        pro_choice: "The <strong>Choice</strong> of Top-Tier Pros & Creators",
        cta_title: "Ready to <span class=\"highlight-gradient\">Optimize</span> Your System?",
        cta_desc: "Join thousands of gamers and professionals who have already transformed their systems with STRIKE OS",
        cta_btn: "Join Our Discord Community <i class=\"fa-solid fa-chevron-right\" style=\"margin-left: 5px; font-size: 0.9rem;\"></i>",
        see_services: "SEE SERVICES"
    },
    vn: {
        nav_home: "Trang Chủ",
        nav_performance: "Hiệu Năng",
        nav_services: "Dịch Vụ",
        nav_feedback: "Đánh Giá",
        btn_discord: "Vào Discord",
        hero_h1_line1: "STRIKE OS.<br>",
        hero_h1_line2: "<span class=\"highlight\">TỐI ƯU HÓA HIỆU NĂNG TỐI ĐA.</span><br>",
        hero_h1_line3: "DÀNH CHO TẤT CẢ MỌI NGƯỜI.",
        hero_desc: "STRIKE OS là phiên bản Windows Custom được xây dựng với mục tiêu mang lại hiệu năng tối đa, độ ổn định cao và trải nghiệm mượt mà cho game thủ, người dùng chuyên nghiệp và những ai muốn khai thác tối đa sức mạnh phần cứng",
        hero_btn_discord: "<i class=\"fa-brands fa-discord\"></i> Vào Discord",
        hero_btn_services: "<i class=\"fa-solid fa-server\"></i> Các Dịch Vụ",
        perf_title: "Đánh Giá Hiệu Năng",
        perf_desc: "So sánh hiệu năng thực tế (Ví dụ)",
        serv_title: "TỐI ƯU HÓA HỆ THỐNG",
        serv_desc: "Được thiết kế để loại bỏ nghẽn cổ chai và tối đa hóa hiệu năng.",
        serv1_sub: "TỐI ƯU HỆ ĐIỀU HÀNH",
        serv1_title: "Strike OS - Window Custom",
        serv1_desc: "STRIKE OS là dự án Windows Custom được phát triển với định hướng tối ưu hiệu năng, độ ổn định và trải nghiệm người dùng.",
        serv1_li1: "Giảm PROCESS nền và dịch vụ không cần thiết",
        serv1_li2: "Tối ưu Registry & Services",
        serv1_li3: "Cải thiện thời gian phản hồi của hệ thống",
        serv1_li4: "Giảm độ trễ đầu vào (Input Latency)",
        serv1_li5: "Tối ưu CPU, RAM và GPU",
        serv1_btn: "ĐĂNG KÝ DỊCH VỤ",
        serv2_sub: "TỐI ƯU HỆ THỐNG",
        serv2_title: "Window Optimization",
        serv2_desc: "Optimize your Windows system for maximum performance",
        serv2_li1: "Lựa chọn Driver, chipset Phù hợp với phần cứng!!",
        serv2_li2: "Network Optimization (tối ưu mạng & độ ổn định kết nối)",
        serv2_li3: "Input Latency Reduction (giảm độ trễ đầu vào)",
        serv2_li4: "Registry Optimization (tinh chỉnh Registry)",
        serv2_li5: "Windows Gaming Optimization Service Fine-tuning",
        serv2_li6: "RAM Usage Optimization (tối ưu sử dụng bộ nhớ)",
        serv2_li7: "Disable background processes không cần thiết",
        serv2_btn: "ĐĂNG KÝ DỊCH VỤ",
        serv3_sub: "PHẦN CỨNG",
        serv3_title: "PC Building",
        serv3_desc: "Tư vấn và xây dựng cấu hình phù hợp với nhu cầu sử dụng",
        serv3_li1: "Tư vấn cấu hình phù hợp theo nhu cầu và ngân sách (Gaming / Streaming / Đồ họa / Làm việc)",
        serv3_li2: "Lựa chọn linh kiện chính hãng, tương thích tối ưu giữa CPU, RAM, GPU và mainboard",
        serv3_li3: "Lắp ráp hệ thống chuyên nghiệp, đi dây gọn gàng và thẩm mỹ",
        serv3_btn: "NHẬN TƯ VẤN",
        serv4_sub: "TỐI ƯU BIOS",
        serv4_title: "Tuning Bios",
        serv4_desc: "Tối ưu BIOS",
        serv4_li1: "Tối ưu EXPO / DOCP, Memory Frequency. FCLK Dành cho cả AM4 và AM5",
        serv4_li2: "Tinh chỉnh Precision Boost Overdrive (PBO), Curve Optimizer Undervolt của từng core CPU",
        serv4_li3: "Bật High Bandwidth Support, Low Latency Support",
        serv4_li4: "Phù hợp cho: CPU AMD Ryzen X3D (5700X3D / 5800X3D / 7800X3D / 7950X3D / 9850X3D / 9800X3D)",
        serv4_btn: "ĐĂNG KÝ DỊCH VỤ",
        fb_title: "Đánh Giá Khách Hàng",
        fb_desc: "Phản hồi từ cộng đồng",
        pro_choice: "Sự <strong>Lựa Chọn</strong> của các Pro Player & Creator hàng đầu",
        cta_title: "Sẵn sàng <span class=\"highlight-gradient\">Tối Ưu</span> Hệ Thống Của Bạn?",
        cta_desc: "Tham gia cùng hàng ngàn game thủ và chuyên gia đã thay đổi hệ thống của họ với STRIKE OS",
        cta_btn: "Tham Gia Cộng Đồng Discord <i class=\"fa-solid fa-chevron-right\" style=\"margin-left: 5px; font-size: 0.9rem;\"></i>",
        see_services: "XEM DỊCH VỤ"
    }
};

function setLanguage(lang) {
    // Save to local storage
    localStorage.setItem('strike_os_lang', lang);

    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-i18n]');
    
    // Update active button
    langBtns.forEach(btn => {
        if(btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Translate elements
    translatableElements.forEach(el => {
        const key = el.dataset.i18n;
        if(translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}

// Event Listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
    
    const savedLang = localStorage.getItem('strike_os_lang') || 'en';
    setLanguage(savedLang);
});
