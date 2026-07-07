// ============================================
// ORGANIC PORTFOLIO — Main JavaScript
// ============================================

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ============================================
// REVEAL ON SCROLL
// ============================================
const revealEls = document.querySelectorAll(".reveal");

// Stagger siblings that reveal together (e.g. the three project cards)
const revealGroups = new Map();
revealEls.forEach((el) => {
  const parent = el.parentElement;
  const index = revealGroups.get(parent) || 0;
  el.style.transitionDelay = `${Math.min(index * 90, 450)}ms`;
  revealGroups.set(parent, index + 1);
});

if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// ============================================
// ACTIVE SECTION (nav link + vine leaf)
// ============================================
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveSection(id) {
  navAnchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
  });
  document.querySelectorAll(".vine-leaf").forEach((leaf) => {
    leaf.classList.toggle("active", leaf.dataset.section === id);
  });
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    },
    { threshold: 0.25 }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

// ============================================
// GROWING VINE SCROLL INDICATOR
// ============================================
const vine = document.querySelector(".vine");

if (vine) {
  const svg = vine.querySelector("svg");
  const track = vine.querySelector(".vine-stem-track");
  const stem = vine.querySelector(".vine-stem");
  const leavesGroup = vine.querySelector(".vine-leaves");
  const SVG_NS = "http://www.w3.org/2000/svg";
  const LEAF_PATH = "M0 0 C-8 -4 -12 -12 -9 -20 C-2 -16 2 -8 0 0 Z";
  const sectionNames = {
    about: "About",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    github: "GitHub",
    contact: "Contact",
  };

  let stemLength = 0;
  let leafData = [];

  function maxScrollDistance() {
    return Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
  }

  function buildVine() {
    if (getComputedStyle(vine).display === "none") {
      stemLength = 0;
      return;
    }

    const h = window.innerHeight;
    svg.setAttribute("viewBox", `0 0 44 ${h}`);
    const d = `M22 0 Q 34 ${h * 0.125} 22 ${h * 0.25} T 22 ${h * 0.5} T 22 ${
      h * 0.75
    } T 22 ${h}`;
    track.setAttribute("d", d);
    stem.setAttribute("d", d);
    stemLength = stem.getTotalLength();
    stem.style.strokeDasharray = stemLength;

    leavesGroup.innerHTML = "";
    leafData = [];
    let side = 1;
    sections.forEach((section) => {
      const fraction = Math.min(
        Math.max(section.offsetTop / maxScrollDistance(), 0.02),
        1
      );
      const point = stem.getPointAtLength(fraction * stemLength);

      const leaf = document.createElementNS(SVG_NS, "g");
      leaf.setAttribute("class", "vine-leaf");
      leaf.dataset.section = section.id;
      leaf.setAttribute(
        "transform",
        `translate(${point.x}, ${point.y}) scale(${side}, 1)`
      );

      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = sectionNames[section.id] || section.id;
      leaf.appendChild(title);

      const shape = document.createElementNS(SVG_NS, "g");
      shape.setAttribute("class", "leaf-shape");
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", LEAF_PATH);
      shape.appendChild(path);
      leaf.appendChild(shape);

      leaf.addEventListener("click", () => {
        section.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      });

      leavesGroup.appendChild(leaf);
      leafData.push({ el: leaf, fraction });
      side *= -1;
    });
  }

  function updateVine() {
    if (!stemLength) return;
    const progress = Math.min(window.scrollY / maxScrollDistance(), 1);
    stem.style.strokeDashoffset = stemLength * (1 - progress);
    leafData.forEach(({ el, fraction }) => {
      el.classList.toggle("grown", progress >= fraction - 0.02);
    });
  }

  let vineTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!vineTicking) {
        vineTicking = true;
        requestAnimationFrame(() => {
          updateVine();
          vineTicking = false;
        });
      }
    },
    { passive: true }
  );

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildVine();
      updateVine();
    }, 150);
  });

  buildVine();
  updateVine();
}

// ============================================
// SCROLL-LINKED BLOB PARALLAX
// ============================================
const parallaxBlobs = [
  { el: document.querySelector(".blob-1"), factor: -0.06 },
  { el: document.querySelector(".blob-2"), factor: 0.08 },
  { el: document.querySelector(".blob-3"), factor: -0.1 },
].filter((blob) => blob.el);

if (parallaxBlobs.length && !prefersReducedMotion) {
  // The `translate` property composes with the blobs' float animation
  const updateBlobs = () => {
    parallaxBlobs.forEach(({ el, factor }) => {
      el.style.translate = `0 ${window.scrollY * factor}px`;
    });
  };

  let blobTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!blobTicking) {
        blobTicking = true;
        requestAnimationFrame(() => {
          updateBlobs();
          blobTicking = false;
        });
      }
    },
    { passive: true }
  );
  updateBlobs();
}

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.querySelector(".contact-form-organic");

if (contactForm) {
  const statusEl = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const message = data.get("message") || "";

    // Until a Formspree form ID is configured, fall back to the visitor's mail app
    if (contactForm.action.includes("YOUR_FORM_ID")) {
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:khainguyen2004@gmail.com?subject=${subject}&body=${body}`;
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    statusEl.textContent = "Sending…";
    statusEl.className = "form-status";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      contactForm.reset();
      statusEl.textContent =
        "Message sent — thank you! I'll get back to you soon.";
      statusEl.classList.add("success");
    } catch (error) {
      statusEl.textContent =
        "Something went wrong. Please email me directly at khainguyen2004@gmail.com.";
      statusEl.classList.add("error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(
  "%c🌿 Hey there, curious developer!",
  "color: #2d4a3e; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cThanks for wandering through my garden.",
  "color: #8b9a7d; font-size: 14px;"
);
console.log(
  "%cFeel free to reach out: khainguyen2004@gmail.com",
  "color: #c4785a; font-size: 12px;"
);
