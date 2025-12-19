// Mobile Menu
const menu = document.querySelector(".navbar__links");
const menuButton = document.querySelector(".navbar__icons");
const overlay = document.querySelector("#overlay");

// Toggle menu when hamburger is clicked
menuButton.addEventListener('click', ()=>{
    menu.classList.toggle("navbar__open"); 
    menuButton.classList.toggle("open"); 
    overlay.classList.toggle("show");
}); 

// Close menu when overlay is clicked
overlay.addEventListener('click', ()=>{
    menu.classList.remove("navbar__open"); 
    menuButton.classList.remove("open"); 
    overlay.classList.remove("show");
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll(".navbar__link a");
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove("navbar__open");
        menuButton.classList.remove("open");
        overlay.classList.remove("show");
    });
});

// gsap.from('header', {duration: 1 , opacity: 0, delay: 2, stagger: .5})
// gsap.from('section', {duration: 1 , opacity: 0, x: '-100%', delay: 3, stagger: .5}); 


// //Flip Card
// const cards = document.querySelectorAll('.card');

// cards.forEach(card => {
//     card.addEventListener('click', function(){
//         card.classList.toggle('card__flip');
//     });
// });

const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
        if (themeMeta) themeMeta.setAttribute('content', '#0b1220');
    } else {
        root.removeAttribute('data-theme');
        if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
        if (themeMeta) themeMeta.setAttribute('content', '#6B9FEE');
    }
}

let savedTheme = localStorage.getItem('theme');
if (!savedTheme) {
    savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
}

const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function handleSchemeChange(e) {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
}
if (mql) {
    if (mql.addEventListener) mql.addEventListener('change', handleSchemeChange);
    else if (mql.addListener) mql.addListener(handleSchemeChange);
}
const headerEl = document.querySelector('header');
function updateHeaderScrolled() {
    if (!headerEl) return;
    headerEl.classList.toggle('scrolled', window.scrollY > 10);
}
updateHeaderScrolled();
window.addEventListener('scroll', updateHeaderScrolled, { passive: true });
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.navbar__link a');

function setActiveLink(id) {
    navAnchors.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href === `#${id}`) a.classList.add('active');
        else a.classList.remove('active');
    });
}

if (sections.length && navAnchors.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, { root: null, threshold: 0.5 });

    sections.forEach(sec => io.observe(sec));
}