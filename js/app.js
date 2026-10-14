/**
 * GERE SZABADSÁGON - Main UI & Scene Controller
 * - 4 Animated Scenes: Gamer Szoba (Monster), Kódolás (Hacker tools + Monster), Természet, Esti Utca.
 * - Arrow buttons, keyboard navigation (1-4, Left/Right), and mobile touch swipe.
 * - Automatic startup background lo-fi music with a clean minimal Mute button.
 */

document.addEventListener("DOMContentLoaded", () => {
  const sceneIds = ["gaming", "coding", "walking", "cooking"];
  let currentSceneIndex = 0;

  // DOM Elements
  const scenes = document.querySelectorAll(".scene-card");
  const prevBtn = document.getElementById("prevSceneBtn");
  const nextBtn = document.getElementById("nextSceneBtn");
  const stageViewport = document.getElementById("stageViewport");
  const muteBtn = document.getElementById("muteBtn");
  const muteIcon = document.getElementById("muteIcon");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const expandIcon = document.querySelector("#fullscreenSvg .icon-expand");
  const compressIcon = document.querySelector("#fullscreenSvg .icon-compress");
  const rotateHint = document.getElementById("rotateHint");

  // ==========================================================
  // FULLSCREEN & AUTO-LANDSCAPE ORIENTATION (Android & iOS)
  // ==========================================================
  let isPseudoFullscreen = false;

  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      isPseudoFullscreen
    );
  }

  async function toggleFullscreen() {
    const isCurrentlyFs = isFullscreen();

    if (!isCurrentlyFs) {
      // 1. Try Native Fullscreen (Desktop & Android)
      const elem = document.documentElement;
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }
      } catch (err) {
        // Native fullscreen not supported or blocked (e.g. iOS Safari)
      }

      // 2. Try Physical Screen Orientation Lock to Landscape (Android)
      let orientationLocked = false;
      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
          orientationLocked = true;
        }
      } catch (err) {
        // Orientation lock not supported or failed (e.g. iOS)
      }

      // 3. iOS Safari & Portrait Fallback:
      // If we are in portrait and orientation wasn't physically locked,
      // activate virtual 90deg landscape cinema mode!
      isPseudoFullscreen = true;
      document.body.classList.add("is-fullscreen");

      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait && !orientationLocked) {
        document.body.classList.add("pseudo-landscape-mode");
      }

      // Trigger scroll trick to minimize iOS Safari address bar
      window.scrollTo(0, 1);

      updateFullscreenUI();
    } else {
      // Exit Fullscreen
      isPseudoFullscreen = false;
      document.body.classList.remove("is-fullscreen", "pseudo-landscape-mode");

      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      } catch (err) {}

      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (err) {}

      updateFullscreenUI();
    }
  }

  function updateFullscreenUI() {
    if (!fullscreenBtn) return;
    const active = isFullscreen();
    if (active) {
      if (expandIcon) expandIcon.style.display = "none";
      if (compressIcon) compressIcon.style.display = "block";
      fullscreenBtn.classList.add("active");
      fullscreenBtn.title = "Kilépés a teljes képernyőből (F)";
    } else {
      if (expandIcon) expandIcon.style.display = "block";
      if (compressIcon) compressIcon.style.display = "none";
      fullscreenBtn.classList.remove("active");
      fullscreenBtn.title = "Teljes képernyő (F)";
    }
  }

  // Handle physical device rotation
  function handleOrientationChange() {
    const isPhysicalLandscape = window.innerWidth > window.innerHeight;
    if (isPhysicalLandscape) {
      // Already physically horizontal: remove CSS virtual rotation
      document.body.classList.remove("pseudo-landscape-mode");
    } else if (isPseudoFullscreen && !document.fullscreenElement) {
      // Turned back to vertical on iOS: restore virtual landscape
      document.body.classList.add("pseudo-landscape-mode");
    }
    updateFullscreenUI();
  }

  window.addEventListener("resize", handleOrientationChange);
  window.addEventListener("orientationchange", handleOrientationChange);

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullscreen);
  }

  if (rotateHint) {
    rotateHint.addEventListener("click", toggleFullscreen);
  }

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      isPseudoFullscreen = false;
      document.body.classList.remove("is-fullscreen", "pseudo-landscape-mode");
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {}
    }
    updateFullscreenUI();
  });
  document.addEventListener("webkitfullscreenchange", updateFullscreenUI);

  // ==========================================================
  // SCENE SWITCHING
  // ==========================================================
  function switchScene(index) {
    if (index < 0) index = sceneIds.length - 1;
    if (index >= sceneIds.length) index = 0;
    currentSceneIndex = index;

    const activeId = sceneIds[currentSceneIndex];

    // Update active scene cards
    scenes.forEach(card => {
      card.classList.toggle("active", card.dataset.sceneId === activeId);
    });

    if (window.sceneFX) {
      window.sceneFX.setActiveScene(activeId);
    }
  }

  // Next / Prev arrow buttons
  if (prevBtn) prevBtn.addEventListener("click", () => switchScene(currentSceneIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => switchScene(currentSceneIndex + 1));

  // Double click / double tap on stage toggles fullscreen
  if (stageViewport) {
    stageViewport.addEventListener("dblclick", toggleFullscreen);
  }

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "ArrowLeft") {
      switchScene(currentSceneIndex - 1);
    } else if (e.key === "ArrowRight") {
      switchScene(currentSceneIndex + 1);
    } else if (e.key >= "1" && e.key <= "4") {
      switchScene(parseInt(e.key) - 1);
    } else if (e.key === "m" || e.key === "M" || e.code === "Space") {
      e.preventDefault();
      handleToggleMute();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // ==========================================================
  // TOUCH SWIPE GESTURES FOR MOBILE
  // ==========================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (stageViewport) {
    stageViewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    stageViewport.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        switchScene(currentSceneIndex + 1);
      } else {
        switchScene(currentSceneIndex - 1);
      }
    }
  }

  // ==========================================================
  // AUDIO CONTROLS (AUTOPLAY + MUTE BUTTON ONLY)
  // ==========================================================
  function handleToggleMute() {
    if (!window.lofiAudio) return;
    const isMuted = window.lofiAudio.toggleMute();
    updateMuteUI(isMuted);
  }

  function updateMuteUI(isMuted) {
    if (!muteBtn || !muteIcon) return;
    if (isMuted) {
      muteIcon.textContent = "🔇";
      muteBtn.classList.add("muted");
      muteBtn.title = "Visszahangosítás (M)";
    } else {
      muteIcon.textContent = "🔊";
      muteBtn.classList.remove("muted");
      muteBtn.title = "Némítás (M)";
    }
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", handleToggleMute);
  }

  const audioPrompt = document.getElementById("audioStartPrompt");

  function hideAudioPrompt() {
    if (!audioPrompt) return;
    audioPrompt.classList.add("hidden");
    setTimeout(() => {
      audioPrompt.style.display = "none";
    }, 450);
  }

  function showAudioPrompt() {
    if (!audioPrompt) return;
    audioPrompt.style.display = "flex";
    requestAnimationFrame(() => {
      audioPrompt.classList.remove("hidden");
    });
  }

  // ==========================================================
  // RELIABLE STARTUP AUTOPLAY & BROWSER POLICY HANDLING
  // ==========================================================
  async function initAudioPlayback() {
    if (!window.lofiAudio) return;
    const isPlaying = await window.lofiAudio.start();

    if (isPlaying && window.lofiAudio.isAudioRunning()) {
      hideAudioPrompt();
      updateMuteUI(false);
    } else {
      // Browser autoplay policy blocked sound on cold start:
      // Show cozy prompt & set muted icon until user touches the screen
      showAudioPrompt();
      updateMuteUI(true);
    }
  }

  // Resume immediately on user interaction
  const resumeOnFirstGesture = async () => {
    if (window.lofiAudio) {
      const isPlaying = await window.lofiAudio.start();
      if (isPlaying && window.lofiAudio.isAudioRunning()) {
        hideAudioPrompt();
        updateMuteUI(false);
      }
    }
    window.removeEventListener("click", resumeOnFirstGesture);
    window.removeEventListener("keydown", resumeOnFirstGesture);
    window.removeEventListener("touchstart", resumeOnFirstGesture);
    window.removeEventListener("pointerdown", resumeOnFirstGesture);
  };

  if (audioPrompt) {
    audioPrompt.addEventListener("click", resumeOnFirstGesture);
  }

  window.addEventListener("click", resumeOnFirstGesture);
  window.addEventListener("keydown", resumeOnFirstGesture);
  window.addEventListener("touchstart", resumeOnFirstGesture, { passive: true });
  window.addEventListener("pointerdown", resumeOnFirstGesture);

  // Attempt initial autoplay
  initAudioPlayback();
});
