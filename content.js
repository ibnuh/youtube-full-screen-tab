(function () {
  "use strict";

  let isTabFullscreen = false;
  const SHORTCUT_KEY = "`";

  // SVG icons — "expand corners" to enter, "shrink corners" to exit
  const ICON_ENTER = `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="#fff" d="M3 3h7v2H5v14h14v-5h2v7H3V3zm11 2h5.59L10.3 14.29l1.41 1.42L21 6.41V12h2V3h-9v2z"/>
    </svg>`;

  const ICON_EXIT = `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="#fff" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
    </svg>`;

  function toggle() {
    isTabFullscreen = !isTabFullscreen;
    document.documentElement.classList.toggle("ytfs-active", isTabFullscreen);
    updateButton();
    window.dispatchEvent(new Event("resize"));
  }

  function updateButton() {
    const btn = document.querySelector(".ytfs-button");
    if (!btn) return;
    const svg = isTabFullscreen ? ICON_EXIT : ICON_ENTER;
    const label = isTabFullscreen
      ? `Exit Tab Fullscreen (${SHORTCUT_KEY})`
      : `Tab Fullscreen (${SHORTCUT_KEY})`;
    btn.innerHTML = svg + `<span class="ytfs-tooltip">${label}</span>`;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("data-tooltip-text", label);
  }

  function createButton() {
    const btn = document.createElement("button");
    btn.className = "ytfs-button ytp-button";
    btn.setAttribute("aria-label", "Tab Fullscreen");
    btn.setAttribute("data-tooltip-text", `Tab Fullscreen (${SHORTCUT_KEY})`);
    btn.innerHTML =
      ICON_ENTER +
      `<span class="ytfs-tooltip">Tab Fullscreen (${SHORTCUT_KEY})</span>`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
    return btn;
  }

  function injectButton() {
    if (document.querySelector(".ytfs-button")) return true;

    const rightControls = document.querySelector(".ytp-right-controls");
    if (!rightControls) return false;

    const fullscreenBtn = rightControls.querySelector(".ytp-fullscreen-button");
    const btn = createButton();

    if (fullscreenBtn && fullscreenBtn.parentNode) {
      fullscreenBtn.parentNode.insertBefore(btn, fullscreenBtn);
    } else {
      rightControls.appendChild(btn);
    }
    return true;
  }

  // Keyboard shortcut
  document.addEventListener(
    "keydown",
    (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        e.target.isContentEditable
      )
        return;

      if (e.key === SHORTCUT_KEY && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }

      if (e.key === "Escape" && isTabFullscreen) {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }
    },
    true
  );

  // Retry injection until successful
  function tryInject(retries) {
    if (injectButton()) return;
    if (retries > 0) {
      setTimeout(() => tryInject(retries - 1), 500);
    }
  }

  function init() {
    // Reset if navigated away from a watch page
    if (isTabFullscreen && !document.querySelector("ytd-watch-flexy")) {
      isTabFullscreen = false;
      document.documentElement.classList.remove("ytfs-active");
    }
    tryInject(20);
  }

  // YouTube SPA navigation event
  document.addEventListener("yt-navigate-finish", init);

  // MutationObserver as fallback
  const observer = new MutationObserver(() => {
    if (
      document.querySelector(".ytp-right-controls") &&
      !document.querySelector(".ytfs-button")
    ) {
      injectButton();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Initial load
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
