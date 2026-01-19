// Enhanced JavaScript for Certificates page

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeParticles();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeCertificateFilters();
    initializeCertificateModal();
    initializeScrollEffects();
    initializeAnimations();
    
    // Check URL for filter parameter
    checkUrlFilter();
});

// Theme Management
function initializeTheme() {          
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme or prefer dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('quantum-theme');
    
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme, themeIcon);
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('quantum-theme', currentTheme);
        updateThemeIcon(currentTheme, themeIcon);
        
        // Update particles for theme
        updateParticlesColor();
        
        // Add transition effect
        document.documentElement.style.transition = 'all 0.8s ease';
        
        // Theme toggle animation
        themeIcon.style.transition = 'transform 0.5s ease';
        themeIcon.style.transform = 'rotate(180deg) scale(1.2)';
        
        setTimeout(() => {
            themeIcon.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        icon.style.color = '#ffd700';
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '';
    }
}

// Particles.js
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const particleColor = isDark ? '#3b82f6' : '#6366f1';
        
        // Reduce particle count on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 70;
        const enableHoverRepulse = !isMobile; // Disable hover interaction on mobile
        
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: particleCount, 
                    density: { 
                        enable: true, 
                        value_area: isMobile ? 1400 : 800
                    } 
                },
                color: { value: particleColor },
                shape: { type: "circle" },
                opacity: { 
                    value: 0.35, 
                    random: true,
                    anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false }
                },
                size: { 
                    value: 2.2, 
                    random: true,
                    anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 100,
                    color: particleColor,
                    opacity: 0.12,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: isMobile ? 0.8 : 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: false }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: enableHoverRepulse, mode: "repulse" },
                    onclick: { enable: false, mode: "push" },
                    resize: true
                }
            },
            retina_detect: isMobile ? false : true
        });
    }
}

function updateParticlesColor() {
    if (window.pJSDom && window.pJSDom[0]) {
        const pJS = window.pJSDom[0].pJS;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const particleColor = isDark ? '#3b82f6' : '#6366f1';
        
        pJS.particles.color.value = particleColor;
        pJS.particles.line_linked.color = particleColor;
        pJS.fn.particlesRefresh();
    }
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
            mobileToggle.style.transform = 'rotate(90deg)';
            document.body.style.overflow = 'hidden';
            
            // Animate menu items
            navLinks.forEach((link, index) => {
                link.style.animationDelay = `${index * 0.1}s`;
                link.classList.add('animate-in');
            });
        } else {
            icon.className = 'fas fa-bars';
            mobileToggle.style.transform = 'rotate(0deg)';
            document.body.style.overflow = '';
            
            navLinks.forEach(link => {
                link.classList.remove('animate-in');
            });
        }
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fas fa-bars';
            mobileToggle.style.transform = 'rotate(0deg)';
            document.body.style.overflow = '';
        });
    });
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Certificate Filter System
function initializeCertificateFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificateCards = document.querySelectorAll('.certificate-card');
    const noCertificatesMessage = document.getElementById('noCertificatesMessage');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter certificates
            let visibleCount = 0;
            
            certificateCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    visibleCount++;
                    
                    // Add animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide no certificates message
            if (visibleCount === 0) {
                noCertificatesMessage.style.display = 'block';
                
                // Add animation
                noCertificatesMessage.style.opacity = '0';
                noCertificatesMessage.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    noCertificatesMessage.style.transition = 'all 0.5s ease';
                    noCertificatesMessage.style.opacity = '1';
                    noCertificatesMessage.style.transform = 'translateY(0)';
                }, 10);
            } else {
                noCertificatesMessage.style.display = 'none';
            }
            
            // Update URL without page reload
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('filter', filterValue);
            window.history.pushState({}, '', newUrl);
        });
    });
}

// Check URL for filter parameter
function checkUrlFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter) {
        const filterButton = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

// Certificate Modal - SIMPLIFIED VERSION
function initializeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalCertificateImg = document.getElementById('modalCertificateImg');
    const downloadBtn = document.getElementById('downloadBtn');
    const printBtn = document.getElementById('printBtn');
    const viewButtons = document.querySelectorAll('.view-certificate');
    
    // Open modal on certificate click
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const title = this.getAttribute('data-title');
            const imgSrc = this.getAttribute('data-img');
            
            modalTitle.textContent = title;
            modalCertificateImg.src = imgSrc;
            downloadBtn.href = imgSrc;
            // Set proper filename for download
            const fileName = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
            downloadBtn.download = fileName;
            downloadBtn.setAttribute('download', fileName);
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // SIMPLE Print Functionality
    printBtn.addEventListener('click', () => {
        // Create a simple print window
        const printWindow = window.open('', '_blank');
        
        // Basic HTML for printing
        printWindow.document.write('<html><head><title>Print Certificate</title>');
        printWindow.document.write('<style>body { text-align: center; padding: 20px; }');
        printWindow.document.write('img { max-width: 100%; height: auto; margin: 20px 0; }');
        printWindow.document.write('h2 { color: #333; margin-bottom: 20px; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>' + modalTitle.textContent + '</h2>');
        printWindow.document.write('<img src="' + modalCertificateImg.src + '" alt="Certificate">');
        printWindow.document.write('<p>Printed from QuantumCoders Certificates Page</p>');
        printWindow.document.write('<script>');
        printWindow.document.write('window.onload = function() {');
        printWindow.document.write('    window.print();');
        printWindow.document.write('    setTimeout(function() {');
        printWindow.document.write('        window.close();');
        printWindow.document.write('    }, 1000);');
        printWindow.document.write('}');
        printWindow.document.write('</script>');
        printWindow.document.write('</body></html>');
        
        printWindow.document.close();
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScrollY = 0;
    let ticking = false;
    
    function updateScrollEffects(scrollY) {
        // Navbar scroll effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    function onScroll() {
        const currentScrollY = window.scrollY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollEffects(currentScrollY);
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.getElementById('mobileToggle');
        
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fas fa-bars';
            mobileToggle.style.transform = 'rotate(0deg)';
            document.body.style.overflow = '';
        }
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const isMobile = window.innerWidth < 768;
    const observerOptions = {
        threshold: 0.05,
        rootMargin: isMobile ? '0px 0px 0px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and certificate cards
    document.querySelectorAll('section, .certificate-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = isMobile ? 'all 0.5s ease' : 'all 0.8s ease';
        observer.observe(el);
    });
    
    // Page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
        
        const loadingBar = document.querySelector('.loading-vibe');
        loadingBar.style.opacity = '0';
        
        setTimeout(() => {
            loadingBar.style.display = 'none';
        }, 500);
    }, 800);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible again
        updateParticlesColor();
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.fn.canvasPaint();
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }, 250);
});

