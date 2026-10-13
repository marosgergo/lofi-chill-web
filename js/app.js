/**
 * GERE SZABADSÁGON - Main UI & Controller
 * 4 Scenes: DayZ Survival, Coding, Riverside Forest Walk, Panel Kitchen.
 * Clean, minimal navigation via arrows, keyboard, and touch swipe.
 * Simplified Lo-Fi Tape audio deck.
 */

document.addEventListener("DOMContentLoaded", () => {
  const sceneIds = ["gaming", "coding", "walking", "cooking"];
  let currentSceneIndex = 0;

  // DOM Elements
  const scenes = document.querySelectorAll(".scene-card");
  const prevBtn = document.getElementById("prevSceneBtn");
  const nextBtn = document.getElementById("nextSceneBtn");
  const stageViewport = document.getElementById("stageViewport");

  // Audio UI Elements
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const prevTrackBtn = document.getElementById("prevTrackBtn");
  const nextTrackBtn = document.getElementById("nextTrackBtn");
  const trackName = document.getElementById("trackName");
  const trackTitleDisplay = document.getElementById("trackTitleDisplay");
  const cassetteModule = document.getElementById("cassetteModule");
  const masterVolumeSlider = document.getElementById("masterVolumeSlider");
  const volValueDisplay = document.getElementById("volValueDisplay");
  const volIcon = document.getElementById("volIcon");

  // ==========================================================
  // SCENE SWITCHING
  // ==========================================================
  function switchScene(index) {
    if (index < 0) index = sceneIds.length - 1;
    if (index >= sceneIds.length) index = 0;
    currentSceneIndex = index;

    const activeId = sceneIds[currentSceneIndex];

    // Update Cards
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
    } else if (e.code === "Space") {
      e.preventDefault();
      toggleMusicPlayback();
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
  // AUDIO PLAYBACK & DECK CONTROLS
  // ==========================================================
  function updateTrackMeta() {
    if (!window.lofiAudio) return;
    const track = window.lofiAudio.getCurrentTrack();
    if (trackName) trackName.textContent = track.title;
    if (trackTitleDisplay) trackTitleDisplay.textContent = `${track.title} • Tape #${window.lofiAudio.currentTrackIndex + 1}`;
  }

  function toggleMusicPlayback() {
    if (!window.lofiAudio) return;
    const isPlaying = window.lofiAudio.togglePlay();
    if (isPlaying) {
      if (playIcon) playIcon.textContent = "⏸";
      if (cassetteModule) cassetteModule.classList.add("playing");
    } else {
      if (playIcon) playIcon.textContent = "▶";
      if (cassetteModule) cassetteModule.classList.remove("playing");
    }
    updateTrackMeta();
  }

  if (playPauseBtn) playPauseBtn.addEventListener("click", toggleMusicPlayback);

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener("click", () => {
      if (!window.lofiAudio) return;
      window.lofiAudio.prevTrack();
      updateTrackMeta();
    });
  }

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener("click", () => {
      if (!window.lofiAudio) return;
      window.lofiAudio.nextTrack();
      updateTrackMeta();
    });
  }

  // Master Volume
  if (masterVolumeSlider) {
    masterVolumeSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value) / 100;
      if (volValueDisplay) volValueDisplay.textContent = `${e.target.value}%`;
      if (window.lofiAudio) {
        window.lofiAudio.setMasterVolume(val);
      }
      if (volIcon) {
        if (val === 0) volIcon.textContent = "🔇";
        else if (val < 0.5) volIcon.textContent = "🔉";
        else volIcon.textContent = "🔊";
      }
    });
  }
});
