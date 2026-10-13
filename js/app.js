/**
 * GERE SZABADSÁGON - Main UI & Controller
 * 5 Scenes: DayZ Survival, Coding, Riverside Forest Walk, Panel Kitchen, Peaceful Sleep.
 * Clean, simplified Lo-Fi Tape audio controls & swipe navigation.
 */

document.addEventListener("DOMContentLoaded", () => {
  const sceneIds = ["gaming", "coding", "walking", "cooking", "sleeping"];
  let currentSceneIndex = 0;

  const sceneSubtitles = {
    gaming: "🎮 DayZ: Túlélés a ködös erdőben...",
    coding: "💻 Éjszakai kódolás a kedvenc zeném mellett...",
    walking: "🌲 Békés séta a folyóparti fenyvesben...",
    cooking: "🍳 Vacsora készítés a panel konyhában...",
    sleeping: "🛏️ Békés pihenés és alvás a meleg takaró alatt..."
  };

  // DOM Elements
  const tabs = document.querySelectorAll(".scene-tab");
  const scenes = document.querySelectorAll(".scene-card");
  const prevBtn = document.getElementById("prevSceneBtn");
  const nextBtn = document.getElementById("nextSceneBtn");
  const statusSubtitle = document.getElementById("statusSubtitle");
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

  // Clock
  const clockDisplay = document.getElementById("clockDisplay");

  // CRT & Mood
  const crtToggleBtn = document.getElementById("crtToggleBtn");
  const themeMoodBtn = document.getElementById("themeMoodBtn");
  const themeMoodIcon = document.getElementById("themeMoodIcon");
  const themeMoodText = document.getElementById("themeMoodText");
  const moods = [
    { id: "night", icon: "🌙", text: "Éjjel", class: "mood-night" },
    { id: "golden", icon: "🌅", text: "Alkonyat", class: "mood-golden" },
    { id: "day", icon: "☀️", text: "Nappal", class: "mood-day" }
  ];
  let currentMoodIdx = 0;

  // Toast
  const toast = document.getElementById("toastNotification");
  const toastEmoji = document.getElementById("toastEmoji");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimeout = null;

  function showToast(message, emoji = "✨") {
    toastEmoji.textContent = emoji;
    toastMessage.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // ==========================================================
  // SCENE SWITCHING
  // ==========================================================
  function switchScene(index) {
    if (index < 0) index = sceneIds.length - 1;
    if (index >= sceneIds.length) index = 0;
    currentSceneIndex = index;

    const activeId = sceneIds[currentSceneIndex];

    // Update Tabs
    tabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.scene === activeId);
    });

    // Update Cards
    scenes.forEach(card => {
      card.classList.toggle("active", card.dataset.sceneId === activeId);
    });

    // Update Status text
    if (statusSubtitle && sceneSubtitles[activeId]) {
      statusSubtitle.style.opacity = "0";
      setTimeout(() => {
        statusSubtitle.textContent = sceneSubtitles[activeId];
        statusSubtitle.style.opacity = "1";
      }, 150);
    }

    // Notify Canvas FX Engine
    if (window.sceneFX) {
      window.sceneFX.setActiveScene(activeId);
    }
  }

  // Tab click listeners
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => switchScene(idx));
  });

  // Next / Prev buttons
  if (prevBtn) prevBtn.addEventListener("click", () => switchScene(currentSceneIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => switchScene(currentSceneIndex + 1));

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "ArrowLeft") {
      switchScene(currentSceneIndex - 1);
    } else if (e.key === "ArrowRight") {
      switchScene(currentSceneIndex + 1);
    } else if (e.key >= "1" && e.key <= "5") {
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
        showToast("Következő jelenet 👉", "🚀");
      } else {
        switchScene(currentSceneIndex - 1);
        showToast("Előző jelenet 👈", "✨");
      }
    }
  }

  // ==========================================================
  // AUDIO PLAYBACK & DECK CONTROLS (SIMPLIFIED & CLEAN)
  // ==========================================================
  function updateTrackMeta() {
    if (!window.lofiAudio) return;
    const track = window.lofiAudio.getCurrentTrack();
    trackName.textContent = track.title;
    trackTitleDisplay.textContent = `${track.title} • Tape #${window.lofiAudio.currentTrackIndex + 1}`;
  }

  function toggleMusicPlayback() {
    if (!window.lofiAudio) return;
    const isPlaying = window.lofiAudio.togglePlay();
    if (isPlaying) {
      playIcon.textContent = "⏸";
      cassetteModule.classList.add("playing");
      showToast(`Most szól: ${window.lofiAudio.getCurrentTrack().title}`, "🎶");
    } else {
      playIcon.textContent = "▶";
      cassetteModule.classList.remove("playing");
      showToast("Lo-fi lejátszás szüneteltetve", "⏸️");
    }
    updateTrackMeta();
  }

  playPauseBtn.addEventListener("click", toggleMusicPlayback);

  prevTrackBtn.addEventListener("click", () => {
    if (!window.lofiAudio) return;
    window.lofiAudio.prevTrack();
    updateTrackMeta();
    showToast(`Szám váltva: ${window.lofiAudio.getCurrentTrack().title}`, "⏮️");
  });

  nextTrackBtn.addEventListener("click", () => {
    if (!window.lofiAudio) return;
    window.lofiAudio.nextTrack();
    updateTrackMeta();
    showToast(`Szám váltva: ${window.lofiAudio.getCurrentTrack().title}`, "⏭️");
  });

  // Master Volume
  masterVolumeSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value) / 100;
    volValueDisplay.textContent = `${e.target.value}%`;
    if (window.lofiAudio) {
      window.lofiAudio.setMasterVolume(val);
    }
    if (val === 0) volIcon.textContent = "🔇";
    else if (val < 0.5) volIcon.textContent = "🔉";
    else volIcon.textContent = "🔊";
  });

  // ==========================================================
  // REAL-TIME CLOCK
  // ==========================================================
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    if (clockDisplay) {
      clockDisplay.textContent = `${hours}:${mins}`;
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ==========================================================
  // CRT & MOOD LIGHTING
  // ==========================================================
  crtToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("crt-enabled");
    const isCrt = document.body.classList.contains("crt-enabled");
    crtToggleBtn.classList.toggle("active", isCrt);
    showToast(isCrt ? "CRT scanline effekt bekapcsolva" : "CRT scanlines kikapcsolva", "📺");
  });

  themeMoodBtn.addEventListener("click", () => {
    document.body.classList.remove(moods[currentMoodIdx].class);
    currentMoodIdx = (currentMoodIdx + 1) % moods.length;
    const nextMood = moods[currentMoodIdx];
    document.body.classList.add(nextMood.class);
    themeMoodIcon.textContent = nextMood.icon;
    themeMoodText.textContent = nextMood.text;
    showToast(`Hangulat átváltva: ${nextMood.text}`, nextMood.icon);
  });

  // Initial toast welcome
  setTimeout(() => {
    showToast("Üdvözöl Gere chill oldalán! Nyomd a ▶ gombot a zenéhez!", "🌴");
  }, 800);
});
