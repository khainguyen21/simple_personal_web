/* ==========================================================================
   Hong Khai Nguyen — Portfolio
   ========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  /* ----------------------------------------------------------------------
     Theme — "ink" (dark) or "paper" (light)
     ---------------------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "paper" ? "#efe9dd" : "#0b0a09");
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "paper" ? "Switch to dark mode" : "Switch to light mode"
      );
    }
  }

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem("theme");
  } catch (e) {
    /* storage blocked — fall back to default */
  }
  applyTheme(storedTheme === "paper" || storedTheme === "ink" ? storedTheme : "ink");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "paper" ? "ink" : "paper";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ----------------------------------------------------------------------
     Masthead state + scroll progress
     ---------------------------------------------------------------------- */
  const masthead = document.querySelector(".masthead");
  const progressBar = document.querySelector(".progress i");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (masthead) masthead.classList.toggle("is-stuck", y > 24);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progressBar.style.transform = "scaleX(" + ratio + ")";
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ----------------------------------------------------------------------
     Mobile drawer
     ---------------------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("drawer");
  const drawerLinks = drawer ? drawer.querySelectorAll(".drawer__nav a") : [];

  drawerLinks.forEach(function (link, i) {
    link.style.setProperty("--i", i);
  });

  function openDrawer() {
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    window.requestAnimationFrame(function () {
      drawer.classList.add("is-open");
    });
  }

  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    window.setTimeout(function () {
      drawer.hidden = true;
    }, 400);
  }

  if (menuToggle && drawer) {
    menuToggle.addEventListener("click", function () {
      if (drawer.hidden) openDrawer();
      else closeDrawer();
    });
    drawerLinks.forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || prefersReduced.matches) {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Counting numbers
     ---------------------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";

    if (prefersReduced.matches) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  } else {
    counters.forEach(runCounter);
  }

  /* ----------------------------------------------------------------------
     Work accordion — click to toggle, hover to preview on desktop
     ---------------------------------------------------------------------- */
  const workItems = Array.prototype.slice.call(document.querySelectorAll(".work__item"));

  function openWork(item) {
    workItems.forEach(function (other) {
      const isTarget = other === item;
      other.classList.toggle("is-open", isTarget);
      const btn = other.querySelector(".work__row");
      if (btn) btn.setAttribute("aria-expanded", isTarget ? "true" : "false");
    });
  }

  function closeWork(item) {
    item.classList.remove("is-open");
    const btn = item.querySelector(".work__row");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  let hoverTimer = null;

  workItems.forEach(function (item) {
    const row = item.querySelector(".work__row");
    if (!row) return;

    row.addEventListener("click", function () {
      if (item.classList.contains("is-open")) closeWork(item);
      else openWork(item);
    });

    if (finePointer.matches) {
      item.addEventListener("mouseenter", function () {
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(function () {
          openWork(item);
        }, 130);
      });
      item.addEventListener("mouseleave", function () {
        window.clearTimeout(hoverTimer);
      });
    }

    row.addEventListener("focus", function () {
      openWork(item);
    });
  });

  if (workItems.length) openWork(workItems[0]);

  /* ----------------------------------------------------------------------
     Active nav link
     ---------------------------------------------------------------------- */
  const navAnchors = document.querySelectorAll(".nav a");
  const watched = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window && navAnchors.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    watched.forEach(function (sec) {
      navObserver.observe(sec);
    });
  }

  /* ----------------------------------------------------------------------
     Custom cursor
     ---------------------------------------------------------------------- */
  const cursor = document.querySelector(".cursor");
  const cursorLabel = cursor ? cursor.querySelector(".cursor__label") : null;

  if (cursor && finePointer.matches && !prefersReduced.matches) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    document.addEventListener(
      "mousemove",
      function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
      },
      { passive: true }
    );

    (function loop() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      window.requestAnimationFrame(loop);
    })();

    const hotSelector = 'a, button, .work__row, .chips span, .course-band__items span';
    document.querySelectorAll(hotSelector).forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-hot");
        const label = el.dataset.cursor;
        if (label && cursorLabel) {
          cursorLabel.textContent = label;
          cursor.classList.add("is-labelled");
        }
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-hot", "is-labelled");
      });
    });

    document.addEventListener("mouseleave", function () {
      cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      cursor.style.opacity = "1";
    });
  }

  /* ----------------------------------------------------------------------
     Copy email on click of the big contact address
     ---------------------------------------------------------------------- */
  const mailLink = document.querySelector(".contact__mail");
  if (mailLink && navigator.clipboard) {
    mailLink.addEventListener("click", function () {
      navigator.clipboard.writeText("khainguyen2004@gmail.com").catch(function () {});
      if (cursorLabel) {
        cursorLabel.textContent = "Copied!";
        window.setTimeout(function () {
          cursorLabel.textContent = "Email me";
        }, 1400);
      }
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------------
     Hello, dev tools
     ---------------------------------------------------------------------- */
  console.log(
    "%cHong Khai Nguyen",
    "font: 600 20px Georgia, serif; color:#ff4d1c;"
  );
  console.log(
    "%cThanks for looking under the hood. Say hi: khainguyen2004@gmail.com",
    "font: 12px monospace; color:#a49b8d;"
  );
})();
