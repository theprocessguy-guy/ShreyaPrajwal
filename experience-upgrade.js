/*
  Shreya birthday website — experience enhancement layer
  Include this AFTER the existing script.js so existing interactions remain in place.
*/
(() => {
  "use strict";

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;

  // 1) Reading progress + glass navigation state.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  let scrollTicking = false;
  const updateScrollUI = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progress.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    document.body.classList.toggle("has-scrolled", window.scrollY > 12);
    scrollTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });
  updateScrollUI();

  // 2) Staggered section reveals. If IntersectionObserver is unavailable, show everything.
  const revealSelector = [
    ".countdown-section .section-kicker",
    ".countdown-section h2",
    ".countdown-section > .muted",
    ".countdown",
    "#countdown-message",
    ".memory-section .section-kicker",
    ".memory-section h2",
    ".memory-section > p",
    ".gallery",
    ".cake-section > .section-kicker",
    ".cake-section > h2",
    ".cake-section > .muted",
    ".cake-wrap",
    "#wish-message",
    "#relight",
    ".song-section .music-orb",
    ".song-section .section-kicker",
    ".song-section h2",
    ".music-player",
    ".letter-card",
    ".final-section > .final-stars",
    ".final-section > .script",
    ".final-section > h2",
    "#surprise-btn"
  ].join(",");

  const revealItems = Array.from(document.querySelectorAll(revealSelector));
  revealItems.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`);
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    revealItems.forEach((element) => revealObserver.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add("is-revealed"));
  }

  // 3) A very subtle pointer glow and hero-light parallax on desktop only.
  if (finePointer && !reducedMotion) {
    const pointerGlow = document.createElement("div");
    pointerGlow.className = "pointer-glow";
    pointerGlow.setAttribute("aria-hidden", "true");
    document.body.appendChild(pointerGlow);

    window.addEventListener("pointermove", (event) => {
      pointerGlow.style.setProperty("--pointer-x", `${event.clientX}px`);
      pointerGlow.style.setProperty("--pointer-y", `${event.clientY}px`);
    }, { passive: true });

    const hero = document.querySelector(".hero");
    const heroGlow = document.querySelector(".hero-glow");
    if (hero && heroGlow) {
      hero.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
        hero.style.setProperty("--hero-shift-x", `${offsetX * 14}px`);
        hero.style.setProperty("--hero-shift-y", `${offsetY * 10}px`);
      }, { passive: true });

      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--hero-shift-x", "0px");
        hero.style.setProperty("--hero-shift-y", "0px");
      }, { passive: true });
    }
  }

  // 4) Link the music orb's animation to actual audio playback state.
  const song = document.getElementById("song");
  if (song) {
    const syncMusicState = () => {
      document.body.classList.toggle("is-music-playing", !song.paused && !song.ended);
    };
    song.addEventListener("play", syncMusicState);
    song.addEventListener("pause", syncMusicState);
    song.addEventListener("ended", syncMusicState);
    syncMusicState();
  }

  // 5) A moon-themed hidden birthday wish.
  const hero = document.querySelector(".hero");
  let moonButton = null;
  let moonDialog = null;
  let lastMoonFocus = null;

  if (hero) {
    moonButton = document.createElement("button");
    moonButton.type = "button";
    moonButton.className = "moon-wish";
    moonButton.setAttribute("aria-label", "Open a little moonlit birthday wish");
    moonButton.setAttribute("aria-haspopup", "dialog");
    moonButton.title = "A little moon magic — tap to reveal a secret wish";
    moonButton.innerHTML = `
      <span class="moon-halo" aria-hidden="true"></span>
      <span class="moon-disc" aria-hidden="true">
        <i class="moon-crater crater-one"></i>
        <i class="moon-crater crater-two"></i>
        <i class="moon-crater crater-three"></i>
        <i class="moon-crater crater-four"></i>
      </span>
      <span class="moon-spark moon-spark-one" aria-hidden="true">✦</span>
      <span class="moon-spark moon-spark-two" aria-hidden="true">✧</span>
      <span class="moon-caption" aria-hidden="true">a little moon magic</span>`;

    const heroGlow = hero.querySelector(".hero-glow");
    if (heroGlow?.nextSibling) hero.insertBefore(moonButton, heroGlow.nextSibling);
    else hero.prepend(moonButton);

    moonDialog = document.createElement("div");
    moonDialog.className = "moon-note-backdrop";
    moonDialog.hidden = true;
    moonDialog.innerHTML = `
      <section class="moon-note-card" role="dialog" aria-modal="true"
        aria-labelledby="moon-note-title" aria-describedby="moon-note-copy" tabindex="-1">
        <button type="button" class="moon-note-close" aria-label="Close moonlit wish">×</button>
        <div class="moon-note-mini-moon" aria-hidden="true">☾</div>
        <p class="moon-note-kicker">A LITTLE NOTE FROM THE MOON</p>
        <h2 id="moon-note-title">Make a wish, Shreya.</h2>
        <p id="moon-note-copy">May the year ahead bring you peaceful nights, brave dreams, unexpected little joys, and a thousand reasons to smile. Keep a little wonder with you, wherever life takes you. Happy Birthday. ♡</p>
        <button type="button" class="moon-note-done">Keep this little wish ✦</button>
        <div class="moon-note-stars" aria-hidden="true">✦　·　✧　·　✦</div>
      </section>`;
    document.body.appendChild(moonDialog);

    const moonCloseButtons = Array.from(moonDialog.querySelectorAll(".moon-note-close, .moon-note-done"));
    const openMoonNote = () => {
      lastMoonFocus = document.activeElement;
      moonDialog.hidden = false;
      document.body.classList.add("moon-note-open");
      window.requestAnimationFrame(() => moonDialog.querySelector(".moon-note-close")?.focus({ preventScroll: true }));
    };
    const closeMoonNote = () => {
      moonDialog.hidden = true;
      document.body.classList.remove("moon-note-open");
      const focusTarget = lastMoonFocus && document.contains(lastMoonFocus) ? lastMoonFocus : moonButton;
      window.requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }));
    };

    moonButton.addEventListener("click", openMoonNote);
    moonCloseButtons.forEach((button) => button.addEventListener("click", closeMoonNote));
    moonDialog.addEventListener("click", (event) => {
      if (event.target === moonDialog) closeMoonNote();
    });
    moonDialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = moonCloseButtons.filter((button) => !button.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && moonDialog && !moonDialog.hidden) {
        moonDialog.querySelector(".moon-note-close")?.click();
      }
    });
  }

  // 6) Quiet looping moonlight ambience. Browsers require a real user gesture
  // before sound can start, so it begins on the first interaction. The main
  // song always takes priority; ambience resumes when that song pauses/ends.
  const mainSong = document.getElementById("song");
  const topbar = document.querySelector(".topbar");
  const ambientAudio = new Audio("Music/moonlight-ambient.wav");
  ambientAudio.loop = true;
  ambientAudio.preload = "auto";
  ambientAudio.volume = 0.17;

  let ambientEnabled = true;
  let firstUserGestureSeen = false;
  let ambientLoadFailed = false;
  let ambientPlaybackBlocked = false;

  const ambientToggle = document.createElement("button");
  ambientToggle.type = "button";
  ambientToggle.className = "ambient-toggle";
  ambientToggle.innerHTML = '<span class="ambient-toggle-icon" aria-hidden="true">☾</span><span class="ambient-toggle-text">Moonlight sound</span>';
  ambientToggle.setAttribute("aria-pressed", "true");
  ambientToggle.setAttribute("aria-label", "Mute quiet moonlight ambience");
  ambientToggle.title = "Quiet moonlight ambience starts after your first interaction. Click to mute or enable it.";
  const navLink = topbar?.querySelector(".nav-link");
  if (navLink) navLink.before(ambientToggle);
  else if (topbar) topbar.appendChild(ambientToggle);

  const ambientStatus = document.createElement("span");
  ambientStatus.className = "experience-sr-only";
  ambientStatus.setAttribute("role", "status");
  ambientStatus.setAttribute("aria-live", "polite");
  document.body.appendChild(ambientStatus);

  const mainSongIsPlaying = () => Boolean(mainSong && !mainSong.paused && !mainSong.ended);

  const syncAmbientControl = () => {
    const playing = !ambientAudio.paused && !ambientAudio.ended;
    ambientToggle.classList.toggle("is-playing", playing);
    ambientToggle.classList.toggle("is-muted", !ambientEnabled);
    ambientToggle.dataset.state = ambientLoadFailed ? "error" : (ambientPlaybackBlocked ? "blocked" : (!ambientEnabled ? "off" : (playing ? "playing" : (mainSongIsPlaying() ? "yielding" : "ready"))));
    ambientToggle.setAttribute("aria-pressed", String(ambientEnabled));
    ambientToggle.setAttribute("aria-label", ambientEnabled ? "Mute quiet moonlight ambience" : "Play quiet moonlight ambience");
    ambientToggle.title = ambientLoadFailed
      ? "Moonlight ambience could not load. Check Music/moonlight-ambient.wav."
      : (ambientPlaybackBlocked
        ? "Moonlight ambience did not start. Click this control to retry."
        : (ambientEnabled
        ? (mainSongIsPlaying() ? "Your song is playing; moonlight ambience will resume when it pauses or ends. Click to mute." : "Quiet moonlight ambience. Click to mute.")
        : "Moonlight ambience is muted. Click to turn it on."));
    const icon = ambientToggle.querySelector(".ambient-toggle-icon");
    if (icon) icon.textContent = ambientEnabled ? "☾" : "♪";
  };

  const startAmbient = async () => {
    if (!ambientEnabled || !firstUserGestureSeen || mainSongIsPlaying() || !ambientAudio.paused) {
      syncAmbientControl();
      return;
    }
    try {
      await ambientAudio.play();
      ambientLoadFailed = false;
      ambientPlaybackBlocked = false;
      ambientStatus.textContent = "Moonlight ambience is playing quietly.";
    } catch (error) {
      // A pause caused by the main song can cancel a pending play promise; that is expected.
      if (error?.name !== "AbortError") {
        ambientPlaybackBlocked = true;
        ambientStatus.textContent = "Moonlight ambience could not start. Use the moonlight sound control to try again.";
      }
    }
    syncAmbientControl();
  };

  const markFirstGesture = (event) => {
    if (firstUserGestureSeen) return;
    firstUserGestureSeen = true;
    const target = event.target instanceof Element ? event.target : null;
    // Don't start the background layer on the sound button (which toggles it)
    // or on the dedicated song button (the main song should take priority).
    if (target?.closest(".ambient-toggle, #music-toggle")) {
      syncAmbientControl();
      return;
    }
    void startAmbient();
  };
  document.addEventListener("pointerdown", markFirstGesture, { capture: true, passive: true, once: true });
  document.addEventListener("keydown", (event) => {
    if (firstUserGestureSeen || !["Enter", " "].includes(event.key)) return;
    markFirstGesture(event);
  }, { capture: true });

  ambientToggle.addEventListener("click", () => {
    ambientEnabled = !ambientEnabled;
    ambientPlaybackBlocked = false;
    firstUserGestureSeen = true;
    if (!ambientEnabled) {
      ambientAudio.pause();
      ambientStatus.textContent = "Moonlight ambience is muted.";
    } else if (!mainSongIsPlaying()) {
      void startAmbient();
    } else {
      ambientStatus.textContent = "Moonlight ambience will resume when your song pauses or ends.";
    }
    syncAmbientControl();
  });

  ambientAudio.addEventListener("play", syncAmbientControl);
  ambientAudio.addEventListener("pause", syncAmbientControl);
  ambientAudio.addEventListener("error", () => {
    ambientLoadFailed = true;
    ambientPlaybackBlocked = false;
    ambientStatus.textContent = "Could not load Music/moonlight-ambient.wav.";
    syncAmbientControl();
  });

  if (mainSong) {
    mainSong.addEventListener("play", () => {
      firstUserGestureSeen = true;
      ambientAudio.pause();
      ambientStatus.textContent = "Your song is playing; moonlight ambience is paused.";
      syncAmbientControl();
    });
    const resumeAmbientAfterMainSong = () => {
      syncAmbientControl();
      if (ambientEnabled && firstUserGestureSeen) void startAmbient();
    };
    mainSong.addEventListener("pause", resumeAmbientAfterMainSong);
    mainSong.addEventListener("ended", resumeAmbientAfterMainSong);
  }
  syncAmbientControl();

  // 5) Add next/previous, swipe, counter, focus restoration, and keyboard support to the existing lightbox.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeButton = document.getElementById("close-lightbox");
  const photoCards = Array.from(document.querySelectorAll(".photo-card"));

  if (lightbox && lightboxImage && closeButton && photoCards.length) {
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Birthday photo memories");

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className = "lightbox-nav-button lightbox-prev";
    previousButton.setAttribute("aria-label", "Previous photo");
    previousButton.textContent = "‹";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "lightbox-nav-button lightbox-next";
    nextButton.setAttribute("aria-label", "Next photo");
    nextButton.textContent = "›";

    const counter = document.createElement("div");
    counter.className = "lightbox-counter";
    counter.setAttribute("role", "status");
    counter.setAttribute("aria-live", "polite");

    lightbox.append(previousButton, nextButton, counter);

    let availableCards = [];
    let currentIndex = 0;
    let lastFocusedCard = null;
    let touchStartX = null;
    let viewerOpen = false;

    const getAvailableCards = () => photoCards.filter((card) => card.classList.contains("has-photo"));

    const setActivePhoto = (index) => {
      availableCards = getAvailableCards();
      if (!availableCards.length) return;

      currentIndex = (index + availableCards.length) % availableCards.length;
      const card = availableCards[currentIndex];
      const imagePath = card.dataset.photo;
      const caption = card.querySelector(".photo-caption")?.textContent?.trim();

      if (imagePath) lightboxImage.src = imagePath;
      lightboxImage.alt = caption || card.getAttribute("aria-label") || `Birthday memory ${currentIndex + 1}`;
      counter.textContent = `${currentIndex + 1} / ${availableCards.length}`;
      const canNavigate = availableCards.length > 1;
      previousButton.hidden = !canNavigate;
      nextButton.hidden = !canNavigate;
      counter.hidden = !canNavigate;
    };

    const openEnhancedLightbox = (card) => {
      if (!card.classList.contains("has-photo")) return;
      availableCards = getAvailableCards();
      const index = availableCards.indexOf(card);
      if (index < 0) return;

      lastFocusedCard = card;
      setActivePhoto(index);
      viewerOpen = true;
      document.body.classList.add("lightbox-open");
      window.requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
    };

    const closeEnhancedLightbox = () => {
      viewerOpen = false;
      document.body.classList.remove("lightbox-open");
      if (lastFocusedCard && document.contains(lastFocusedCard)) {
        window.requestAnimationFrame(() => lastFocusedCard.focus({ preventScroll: true }));
      }
    };

    photoCards.forEach((card) => {
      // Existing script.js still owns opening the original viewer; this adds navigation state.
      card.addEventListener("click", () => openEnhancedLightbox(card));
    });

    previousButton.addEventListener("click", () => setActivePhoto(currentIndex - 1));
    nextButton.addEventListener("click", () => setActivePhoto(currentIndex + 1));

    closeButton.addEventListener("click", closeEnhancedLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeEnhancedLightbox();
    });

    lightbox.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches?.[0]?.clientX ?? null;
    }, { passive: true });

    lightbox.addEventListener("touchend", (event) => {
      if (touchStartX === null || availableCards.length < 2) return;
      const endX = event.changedTouches?.[0]?.clientX;
      if (typeof endX !== "number") return;
      const distance = endX - touchStartX;
      if (Math.abs(distance) > 45) setActivePhoto(currentIndex + (distance < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (viewerOpen) closeEnhancedLightbox();
        return;
      }

      if (!viewerOpen || lightbox.hidden) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActivePhoto(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActivePhoto(currentIndex + 1);
      } else if (event.key === "Tab") {
        const focusable = [closeButton, previousButton, nextButton].filter((button) => !button.hidden);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
