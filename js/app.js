/**
 * GERE SZABADSÁGON - Main UI & Scene Controller
 * - 4 Scenes: DayZ Survival, Coding, Riverside Forest Walk, Panel Kitchen.
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

    // Notify Canvas FX Engine
    if (window.sceneFX) {
      window.sceneFX.setActiveScene(activeId);
    }
  }

  // Next / Prev arrow buttons
  if (prevBtn) prevBtn.addEventListener("click", () => switchScene(currentSceneIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => switchScene(currentSceneIndex + 1));

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

  // ==========================================================
  // RELIABLE STARTUP AUTOPLAY
  // ==========================================================
  function startAudio() {
    if (!window.lofiAudio) return;
    window.lofiAudio.start();
    updateMuteUI(window.lofiAudio.isMuted);
  }

  // 1. Try immediate autoplay on page load
  startAudio();

  // 2. Browser autoplay fallback: resume seamlessly on first user interaction
  const resumeOnFirstGesture = () => {
    if (window.lofiAudio) {
      window.lofiAudio.start();
    }
    window.removeEventListener("click", resumeOnFirstGesture);
    window.removeEventListener("keydown", resumeOnFirstGesture);
    window.removeEventListener("touchstart", resumeOnFirstGesture);
    window.removeEventListener("pointerdown", resumeOnFirstGesture);
  };

  window.addEventListener("click", resumeOnFirstGesture, { once: true });
  window.addEventListener("keydown", resumeOnFirstGesture, { once: true });
  window.addEventListener("touchstart", resumeOnFirstGesture, { once: true });
  window.addEventListener("pointerdown", resumeOnFirstGesture, { once: true });
});
