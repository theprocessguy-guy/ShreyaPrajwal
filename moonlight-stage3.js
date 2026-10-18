/*
  Shreya birthday website — Stage 3: the moonlit story
  Load after script.js and experience-upgrade.js. Additive, no libraries required.
*/
(() => {
  "use strict";

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  // A tiny constellation that lights up as each part of the story is visited.
  const journey = [
    { selector: "#home", label: "The beginning" },
    { selector: "#countdown", label: "The countdown" },
    { selector: "#memories", label: "Little memories" },
    { selector: "#cake", label: "Make a wish" },
    { selector: ".song-section", label: "Our soundtrack" },
    { selector: "#letter", label: "A little letter" },
    { selector: ".final-section", label: "One last thing" }
  ].filter((item) => document.querySelector(item.selector));

  if (journey.length) {
    const starPositions = [
      [16, 83], [43, 47], [72, 72], [96, 25], [123, 59], [154, 34], [187, 75]
    ];
    const svgLines = starPositions.slice(0, journey.length - 1).map((point, index) => {
      const next = starPositions[index + 1];
      return `<line class="constellation-line" data-line="${index}" x1="${point[0]}" y1="${point[1]}" x2="${next[0]}" y2="${next[1]}" />`;
    }).join("");
    const svgStars = starPositions.slice(0, journey.length).map(([x, y], index) => `
      <g class="constellation-star" data-star="${index}" aria-hidden="true">
        <circle class="constellation-star-glow" cx="${x}" cy="${y}" r="9" />
        <circle class="constellation-star-core" cx="${x}" cy="${y}" r="3.1" />
      </g>`).join("");

    const widget = document.createElement("aside");
    widget.className = "constellation-widget";
    widget.innerHTML = `
      <button class="constellation-toggle" type="button" aria-expanded="false" aria-controls="constellation-panel">
        <span class="constellation-toggle-mark" aria-hidden="true">✦</span>
        <span class="constellation-toggle-label">Our little sky</span>
        <span class="constellation-count"><span data-lit-count>0</span>/${journey.length}</span>
      </button>
      <div class="constellation-panel" id="constellation-panel" hidden>
        <div class="constellation-panel-heading">
          <div><span class="constellation-kicker">A STORY IN STARS</span><strong>Your constellation</strong></div>
          <button class="constellation-collapse" type="button" aria-label="Close constellation">×</button>
        </div>
        <svg class="constellation-map" viewBox="0 0 205 105" aria-hidden="true" focusable="false">
          ${svgLines}${svgStars}
        </svg>
        <p class="constellation-status" role="status" aria-live="polite">Every story begins with one little light.</p>
        <p class="constellation-bonus" hidden>Every star found. May you always find a little moonlight, even on the longest nights. ♡</p>
      </div>`;
    document.body.appendChild(widget);

    const toggle = widget.querySelector(".constellation-toggle");
    const panel = widget.querySelector(".constellation-panel");
    const collapse = widget.querySelector(".constellation-collapse");
    const count = widget.querySelector("[data-lit-count]");
    const status = widget.querySelector(".constellation-status");
    const bonus = widget.querySelector(".constellation-bonus");
    const visited = new Set();
    const messages = [
      "The first star is always a beginning.",
      "A little closer to your special day.",
      "Some moments deserve their own stars.",
      "A wish is taking shape in the night.",
      "Every story has a song of its own.",
      "Some words are little lights to keep.",
      "The last star is here. Your story has a sky of its own."
    ];

    const refreshConstellation = () => {
      count.textContent = String(visited.size);
      widget.querySelectorAll(".constellation-star").forEach((star) => {
        const index = Number(star.dataset.star);
        star.classList.toggle("is-lit", visited.has(index));
      });
      widget.querySelectorAll(".constellation-line").forEach((line) => {
        const index = Number(line.dataset.line);
        line.classList.toggle("is-lit", visited.has(index) && visited.has(index + 1));
      });
      toggle.classList.toggle("has-progress", visited.size > 0);
      if (visited.size === journey.length) {
        status.textContent = "Every part of the story has found its place in the sky.";
        bonus.hidden = false;
        widget.classList.add("all-stars-found");
      } else {
        const mostRecent = Math.max(-1, ...visited);
        status.textContent = mostRecent >= 0
          ? messages[Math.min(mostRecent, messages.length - 1)]
          : "Every story begins with one little light.";
        bonus.hidden = true;
        widget.classList.remove("all-stars-found");
      }
    };

    const openPanel = (open) => {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      widget.classList.toggle("is-open", open);
      if (open) collapse.focus({ preventScroll: true });
      else toggle.focus({ preventScroll: true });
    };

    toggle.addEventListener("click", () => openPanel(panel.hidden));
    collapse.addEventListener("click", () => openPanel(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) openPanel(false);
    });

    journey.forEach((item, index) => {
      const target = document.querySelector(item.selector);
      if (!target) return;
      if (index === 0) visited.add(index);
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            visited.add(index);
            refreshConstellation();
            observer.disconnect();
          }
        }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
        observer.observe(target);
      } else {
        const checkVisibility = () => {
          const rect = target.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15) {
            visited.add(index);
            refreshConstellation();
            window.removeEventListener("scroll", checkVisibility);
          }
        };
        window.addEventListener("scroll", checkVisibility, { passive: true });
        checkVisibility();
      }
    });
    refreshConstellation();
  }

  // Small star particles, used at the cake and when the final envelope opens.
  const burstStarlight = (anchor, amount = 20) => {
    if (reducedMotion || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const symbols = ["✦", "✧", "⋆", "♡", "·"];
    for (let i = 0; i < amount; i += 1) {
      const particle = document.createElement("span");
      particle.className = "moonlight-particle";
      particle.textContent = symbols[i % symbols.length];
      particle.setAttribute("aria-hidden", "true");
      const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.28;
      const distance = 42 + Math.random() * 118;
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.setProperty("--drift-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--drift-y", `${Math.sin(angle) * distance - 25}px`);
      particle.style.setProperty("--particle-rotation", `${Math.round(Math.random() * 160 - 80)}deg`);
      particle.style.setProperty("--particle-duration", `${1.1 + Math.random() * 0.9}s`);
      document.body.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
      window.setTimeout(() => particle.remove(), 2400);
    }
  };

  // When all three candles go out, make the cake section glow and release starlight.
  const candles = document.getElementById("candles");
  const cakeSection = document.getElementById("cake");
  const relightButton = document.getElementById("relight");
  const wishMessage = document.getElementById("wish-message");
  if (candles && cakeSection) {
    const ceremony = document.createElement("p");
    ceremony.className = "moon-cake-ceremony";
    ceremony.hidden = true;
    ceremony.setAttribute("role", "status");
    ceremony.setAttribute("aria-live", "polite");
    ceremony.textContent = "The candles are out, the stars are listening. May your wish find its way to you. ✨";
    if (wishMessage?.parentNode) wishMessage.insertAdjacentElement("afterend", ceremony);

    candles.addEventListener("click", () => {
      const allOut = candles.querySelectorAll(".candle:not(.out)").length === 0;
      if (allOut && !cakeSection.classList.contains("moon-wish-celebrated")) {
        cakeSection.classList.add("moon-wish-celebrated");
        ceremony.hidden = false;
        burstStarlight(cakeSection.querySelector(".cake-wrap") || candles, 26);
      }
    });
    relightButton?.addEventListener("click", () => {
      cakeSection.classList.remove("moon-wish-celebrated");
      ceremony.hidden = true;
    });
  }

  // Transform the existing final-surprise panel into a closed envelope that opens on tap.
  // The original heartfelt message is preserved and placed inside the letter.
  const surpriseButton = document.getElementById("surprise-btn");
  const finalSurprise = document.getElementById("final-surprise");
  if (surpriseButton && finalSurprise) {
    const originalMessage = finalSurprise.innerHTML;
    finalSurprise.innerHTML = `
      <div class="moon-envelope-experience">
        <p class="moon-envelope-intro">A last little thing, delivered under your moon.</p>
        <button class="moon-envelope" type="button" aria-expanded="false" aria-controls="moon-envelope-letter" aria-label="Open the birthday envelope for Shreya">
          <span class="moon-envelope-aura" aria-hidden="true"></span>
          <span class="moon-envelope-back" aria-hidden="true"></span>
          <span class="moon-envelope-paper" aria-hidden="true"><span>For Shreya</span><small>with all my love</small></span>
          <span class="moon-envelope-front" aria-hidden="true"></span>
          <span class="moon-envelope-flap" aria-hidden="true"></span>
          <span class="moon-envelope-seal" aria-hidden="true">♥</span>
        </button>
        <p class="moon-envelope-hint">Tap the little seal to open your note</p>
        <div class="moon-envelope-letter" id="moon-envelope-letter" hidden>${originalMessage}</div>
      </div>`;

    const envelope = finalSurprise.querySelector(".moon-envelope");
    const letter = finalSurprise.querySelector(".moon-envelope-letter");
    const hint = finalSurprise.querySelector(".moon-envelope-hint");

    const setEnvelopeOpen = (open) => {
      envelope.classList.toggle("is-open", open);
      envelope.setAttribute("aria-expanded", String(open));
      envelope.setAttribute("aria-label", open ? "Close the birthday envelope" : "Open the birthday envelope for Shreya");
      letter.hidden = !open;
      hint.textContent = open ? "A little note, just for you ♡" : "Tap the little seal to open your note";
      if (open) {
        burstStarlight(envelope, 24);
        window.setTimeout(() => letter.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" }), reducedMotion ? 0 : 160);
      }
    };

    envelope.addEventListener("click", () => setEnvelopeOpen(envelope.getAttribute("aria-expanded") !== "true"));
    surpriseButton.addEventListener("click", () => {
      // The original script toggles the panel first; this listener responds to the resulting state.
      if (finalSurprise.hidden) setEnvelopeOpen(false);
      else setEnvelopeOpen(false);
    });
  }

  // Prevent the floating tracker from sitting over photo or moon dialogs.
  const syncOverlayClasses = () => {
    const isDialogOpen = document.body.classList.contains("moon-note-open") ||
      document.body.classList.contains("lightbox-open");
    document.body.classList.toggle("experience-dialog-open", isDialogOpen);
  };
  const classObserver = new MutationObserver(syncOverlayClasses);
  classObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  syncOverlayClasses();
})();
