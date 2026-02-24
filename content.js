(function () {
  "use strict";

  let isTabFullscreen = false;
  const SHORTCUT_KEY = "`";

  // SVG icons for the button
  const ICON_ENTER = `
    <svg viewBox="0 0 24 24">
      <path d="M3 3h7v2H5v14h14v-5h2v7H3V3zm11 2h5.59L10.3 14.29l1.41 1.42L21 6.41V12h2V3h-9v2z"/>
    </svg>`;

  const ICON_EXIT = `
    <svg viewBox="0 0 24 24">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
    </svg>`;

  function toggle() {
    isTabFullscreen = !isTabFullscreen;
    document.documentElement.classList.toggle("ytfs-active", isTabFullscreen);
    updateButton();

    // Tell YouTube player to recalculate size
    window.dispatchEvent(new Event("resize"));
  }

  function updateButton() {
    const btn = document.querySelector(".ytfs-button");
    if (!btn) return;
    btn.innerHTML = isTabFullscreen ? ICON_EXIT : ICON_ENTER;
    const tooltip = document.createElement("span");
    tooltip.className = "ytfs-tooltip";
    tooltip.textContent = isTabFullscreen
      ? `Exit Tab Fullscreen (${SHORTCUT_KEY})`
      : `Tab Fullscreen (${SHORTCUT_KEY})`;
    btn.appendChild(tooltip);
  }

  function injectButton() {
    if (document.querySelector(".ytfs-button")) return;

    const rightControls = document.querySelector(".ytp-right-controls");
    if (!rightControls) return;

    const fullscreenBtn = rightControls.querySelector(".ytp-fullscreen-button");

    const btn = document.createElement("button");
    btn.className = "ytfs-button ytp-button";
    btn.title = "";
    btn.setAttribute("aria-label", "Tab Fullscreen");
    btn.innerHTML = ICON_ENTER;

    const tooltip = document.createElement("span");
    tooltip.className = "ytfs-tooltip";
    tooltip.textContent = `Tab Fullscreen (${SHORTCUT_KEY})`;
    btn.appendChild(tooltip);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    // Insert before the native fullscreen button
    if (fullscreenBtn) {
      rightControls.insertBefore(btn, fullscreenBtn);
    } else {
      rightControls.appendChild(btn);
    }
  }

  // Keyboard shortcut
  document.addEventListener("keydown", (e) => {
    // Don't trigger when typing in inputs
    const tag = e.target.tagName.toLowerCase();
    const editable = e.target.isContentEditable;
    if (tag === "input" || tag === "textarea" || editable) return;

    if (e.key === SHORTCUT_KEY && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    }

    // Also exit on Escape
    if (e.key === "Escape" && isTabFullscreen) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    }
  });

  // Watch for YouTube's SPA navigation and re-inject button
  function init() {
    injectButton();

    // If tab fullscreen was active and page navigated, reset state
    if (isTabFullscreen && !document.querySelector("ytd-watch-flexy")) {
      isTabFullscreen = false;
      document.documentElement.classList.remove("ytfs-active");
    }
  }

  // Observe DOM changes to re-inject the button after SPA navigation
  const observer = new MutationObserver(() => {
    if (
      document.querySelector(".ytp-right-controls") &&
      !document.querySelector(".ytfs-button")
    ) {
      init();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial injection
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
