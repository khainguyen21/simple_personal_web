/* ==========================================================================
   Hong Khai Nguyen — Portfolio
   Hide or show the photo. The saved choice is applied in <head> before paint.
   ========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const toggle = document.getElementById("photoToggle");

  function syncLabel() {
    toggle.textContent = root.classList.contains("no-photo") ? "Show photo" : "Hide photo";
  }

  toggle.addEventListener("click", function () {
    const hidden = root.classList.toggle("no-photo");
    syncLabel();
    try {
      localStorage.setItem("photo", hidden ? "hidden" : "shown");
    } catch (e) {
      /* storage blocked — the choice just won't be remembered */
    }
  });

  syncLabel();
  toggle.hidden = false;
})();
