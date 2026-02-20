// ============================================
// CYBER TERMINAL PORTFOLIO - Main JavaScript
// ============================================

// Mobile Menu
const menu = document.querySelector(".navbar__links");
const menuButton = document.querySelector(".navbar__icons");
const overlay = document.querySelector("#overlay");

if (menuButton) {
    menuButton.addEventListener('click', () => {
        menu.classList.toggle("navbar__open");
        menuButton.classList.toggle("open");
        overlay.classList.toggle("show");
        document.body.style.overflow = menu.classList.contains("navbar__open") ? 'hidden' : '';
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        menu.classList.remove("navbar__open");
        menuButton.classList.remove("open");
        overlay.classList.remove("show");
        document.body.style.overflow = '';
    });
}

const navLinks = document.querySelectorAll(".navbar__link a");
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove("navbar__open");
        menuButton.classList.remove("open");
        overlay.classList.remove("show");
        document.body.style.overflow = '';
    });
});

// ============================================
// TYPING EFFECT
// ============================================
const typingText = document.querySelector('.typing-text');
const titles = [
    'Backend Software Engineer',
    'Java & Spring Boot Developer',
    'Computer Science Student',
    'Problem Solver',
    'Open to Internships'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    if (!typingText) return;

    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

setTimeout(typeEffect, 1000);

// ============================================
// THEME TOGGLE
// ============================================
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-terminal');
            themeIcon.classList.add('fa-moon');
        }
        if (themeMeta) themeMeta.setAttribute('content', '#f0f4f8');
    } else {
        root.removeAttribute('data-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-terminal');
        }
        if (themeMeta) themeMeta.setAttribute('content', '#0a0a0f');
    }
}

let savedTheme = localStorage.getItem('theme');
if (!savedTheme) {
    savedTheme = 'dark';
}
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        const next = isLight ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const headerEl = document.querySelector('header');

function updateHeaderScrolled() {
    if (!headerEl) return;
    headerEl.classList.toggle('scrolled', window.scrollY > 50);
}

updateHeaderScrolled();
window.addEventListener('scroll', updateHeaderScrolled, { passive: true });

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.navbar__link a');

function setActiveLink(id) {
    navAnchors.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href === `#${id}`) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}

if (sections.length && navAnchors.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, { root: null, threshold: 0.3 });

    sections.forEach(sec => io.observe(sec));
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const animatedElements = document.querySelectorAll('.fade-in-up');

if (animatedElements.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SKILL ITEMS HOVER EFFECT
// ============================================
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-4px) scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c Hey there, curious developer! 👋', 'color: #00ff88; font-size: 16px; font-weight: bold;');
console.log('%c Thanks for checking out my portfolio.', 'color: #00d4ff; font-size: 14px;');
console.log('%c Feel free to reach out: khainguyen2004@gmail.com', 'color: #ff006e; font-size: 12px;');