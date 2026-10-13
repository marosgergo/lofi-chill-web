/**
 * GERE SZABADSÁGON - 5 Scene Animation & Particle Engine
 * 1. DayZ Survival (aiming mouse, tapping keys, fog, tea steam)
 * 2. Coding (both hands typing, live VS Code typing, rain on window)
 * 3. Riverside Forest Walk (flowing water ripples, falling leaves, walking stride)
 * 4. Panel Kitchen (stirring spoon, simmering soup bubbles, radiator cat)
 * 5. Sleeping (breathing blanket, floating Zzz, moonbeam dust, twinkling stars)
 */

class SceneAnimationEngine {
  constructor() {
    this.canvases = {};
    this.contexts = {};
    this.activeScene = "gaming";
    this.dpr = window.devicePixelRatio || 1;

    this.state = {
      // Global
      isBlinking: false,
      lastBlinkTime: 0,

      // Scene 1: DayZ
      dayzFog: [],
      
      // Scene 2: Coding
      codeIndex: 0,
      codeCharIndex: 0,
      codeLines: [
        "// Gere szabadság: AKTÍV",
        "import { relax, chill } from 'vacation';",
        "const status = 'OFF_DUTY';",
        "while (vacation) {",
        "  writeCleanCode();",
        "  drinkCoffee();",
        "  listenToLoFi();",
        "}"
      ],
      codeBuffer: [""],
      lastCodeTypeTime: 0,
      windowRain: [],

      // Scene 3: Riverside Forest
      leaves: [],
      riverRipples: [],

      // Scene 4: Panel Kitchen
      bubbles: [],
      kitchenSteam: [],

      // Scene 5: Sleeping
      sleepZzz: [],
      lastSleepZzzTime: 0,
      stars: []
    };

    this.init();
  }

  init() {
    const sceneIds = ["gaming", "coding", "walking", "cooking", "sleeping"];
    sceneIds.forEach(id => {
      const c = document.getElementById(`canvas-${id}`);
      if (c) {
        this.canvases[id] = c;
        this.contexts[id] = c.getContext("2d");
        this.resizeCanvas(id);
      }
    });

    window.addEventListener("resize", () => {
      sceneIds.forEach(id => this.resizeCanvas(id));
    });

    this.initParticles();
    this.startLoop();
  }

  resizeCanvas(id) {
    const c = this.canvases[id];
    if (!c) return;
    const rect = c.parentElement.getBoundingClientRect();
    c.width = rect.width * this.dpr;
    c.height = rect.height * this.dpr;
    c.style.width = `${rect.width}px`;
    c.style.height = `${rect.height}px`;
    const ctx = this.contexts[id];
    ctx.scale(this.dpr, this.dpr);
  }

  initParticles() {
    // Rain on coding window
    this.state.windowRain = [];
    for (let i = 0; i < 40; i++) {
      this.state.windowRain.push({
        x: Math.random() * 400,
        y: Math.random() * 300,
        length: Math.random() * 12 + 8,
        speed: Math.random() * 4 + 3
      });
    }

    // Forest leaves
    this.state.leaves = [];
    for (let i = 0; i < 35; i++) {
      this.state.leaves.push({
        x: Math.random() * 900,
        y: Math.random() * 600,
        size: Math.random() * 4 + 3,
        speedY: Math.random() * 1.4 + 0.6,
        speedX: -(Math.random() * 1.6 + 0.8),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        color: ["#e67e22", "#d35400", "#f39c12", "#27ae60"][Math.floor(Math.random() * 4)]
      });
    }

    // River ripples
    this.state.riverRipples = [];
    for (let i = 0; i < 20; i++) {
      this.state.riverRipples.push({
        x: Math.random(),
        y: Math.random(),
        width: Math.random() * 20 + 10,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    // Twinkling stars in sleeping scene skyline window (normalized 0..1)
    this.state.stars = [];
    for (let i = 0; i < 30; i++) {
      this.state.stars.push({
        nx: 0.35 + Math.random() * 0.38,
        ny: 0.10 + Math.random() * 0.45,
        size: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  setActiveScene(sceneId) {
    this.activeScene = sceneId;
    if (this.canvases[sceneId]) {
      this.resizeCanvas(sceneId);
    }
  }

  startLoop() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    const id = this.activeScene;
    const canvas = this.canvases[id];
    const ctx = this.contexts[id];
    if (!canvas || !ctx) return;

    const w = canvas.width / this.dpr;
    const h = canvas.height / this.dpr;
    ctx.clearRect(0, 0, w, h);

    const now = Date.now();
    // Eye blink update
    if (now - this.state.lastBlinkTime > 3800) {
      this.state.isBlinking = true;
      if (now - this.state.lastBlinkTime > 3930) {
        this.state.isBlinking = false;
        this.state.lastBlinkTime = now;
      }
    }

    if (id === "gaming") {
      this.renderDayZ(ctx, w, h, now);
    } else if (id === "coding") {
      this.renderCoding(ctx, w, h, now);
    } else if (id === "walking") {
      this.renderForestWalk(ctx, w, h, now);
    } else if (id === "cooking") {
      this.renderPanelKitchen(ctx, w, h, now);
    } else if (id === "sleeping") {
      this.renderSleeping(ctx, w, h, now);
    }
  }

  // ==========================================================
  // 1. DAYZ SURVIVAL GAMING ANIMATION
  // ==========================================================
  renderDayZ(ctx, w, h, now) {
    // 1A. Hot Tea Steam (x: 0.23w, y: 0.88h)
    const mugX = w * 0.24;
    const mugY = h * 0.84;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const sx = mugX + Math.sin(now * 0.003 + i * 0.2) * 5;
      const sy = mugY - i * 2;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // 1B. Hand Aiming Mouse (x: 0.58w, y: 0.76h)
    const mouseHandX = w * 0.58 + Math.sin(now * 0.004) * 4;
    const mouseHandY = h * 0.76 + Math.cos(now * 0.004) * 2;
    ctx.save();
    ctx.fillStyle = "#e8b898";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillRect(mouseHandX - 8, mouseHandY - 4, 18, 12);
    // Mouse click pulse
    if (Math.sin(now * 0.01) > 0.8) {
      ctx.fillStyle = "#4deeea";
      ctx.fillRect(mouseHandX - 10, mouseHandY - 6, 4, 4);
    }
    ctx.restore();

    // 1C. Left Hand Tapping WASD Keyboard (x: 0.44w, y: 0.83h)
    const wasdHandX = w * 0.44;
    const wasdHandY = h * 0.83 + (Math.sin(now * 0.015) > 0 ? 2 : 0);
    ctx.save();
    ctx.fillStyle = "#e8b898";
    ctx.fillRect(wasdHandX - 8, wasdHandY - 4, 16, 10);
    // Fingers tapping
    ctx.fillRect(wasdHandX - 7, wasdHandY + 6, 4, 3);
    ctx.fillRect(wasdHandX - 1, wasdHandY + 7, 4, 3);
    ctx.fillRect(wasdHandX + 5, wasdHandY + 6, 4, 3);
    ctx.restore();

    // 1D. Compass Pulse (top-right of screen: x: 0.51w, y: 0.32h)
    const compassX = w * 0.515;
    const compassY = h * 0.32;
    const needleAngle = Math.sin(now * 0.003) * 0.15;
    ctx.save();
    ctx.translate(compassX, compassY);
    ctx.rotate(needleAngle);
    ctx.strokeStyle = "#ff416c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(0, -9);
    ctx.stroke();
    ctx.restore();

    // 1E. Gere Head Bobbing to Lo-Fi Beat & Eye Blink
    const isPlaying = window.lofiAudio && window.lofiAudio.isPlaying;
    const beatBob = isPlaying ? Math.sin(now * 0.0078) * 2 : Math.sin(now * 0.002) * 1;
    if (this.state.isBlinking) {
      ctx.fillStyle = "#1e1e2d";
      ctx.fillRect(w * 0.635, h * 0.36 + beatBob, 7, 2.5);
      ctx.fillRect(w * 0.695, h * 0.36 + beatBob, 7, 2.5);
    }
  }

  // ==========================================================
  // 2. CODING & DEV SCENE ANIMATION
  // ==========================================================
  renderCoding(ctx, w, h, now) {
    // 2A. Coffee Mug Steam (x: 0.24w, y: 0.85h)
    const mugX = w * 0.24;
    const mugY = h * 0.85;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const sx = mugX + Math.sin(now * 0.003 + i * 0.2) * 5;
      const sy = mugY - i * 2;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // 2B. LIVE CODING ON MONITORS
    // Right monitor terminal (x: 0.39w, y: 0.28h to 0.58w, 0.44h)
    const termX = w * 0.385;
    const termY = h * 0.29;
    const termW = w * 0.19;
    const termH = h * 0.15;

    // Type code
    if (now - this.state.lastCodeTypeTime > 80) {
      this.state.lastCodeTypeTime = now;
      const currentFullLine = this.state.codeLines[this.state.codeIndex];
      if (this.state.codeCharIndex < currentFullLine.length) {
        this.state.codeBuffer[this.state.codeBuffer.length - 1] += currentFullLine[this.state.codeCharIndex];
        this.state.codeCharIndex++;
      } else {
        this.state.codeIndex = (this.state.codeIndex + 1) % this.state.codeLines.length;
        this.state.codeCharIndex = 0;
        this.state.codeBuffer.push("");
        if (this.state.codeBuffer.length > 5) this.state.codeBuffer.shift();
      }
    }

    ctx.save();
    ctx.font = "9px monospace";
    ctx.fillStyle = "#38ef7d";
    ctx.shadowColor = "#38ef7d";
    ctx.shadowBlur = 4;
    this.state.codeBuffer.forEach((line, idx) => {
      const ly = termY + 12 + idx * 10;
      if (ly < termY + termH - 2) ctx.fillText(line, termX + 6, ly);
    });
    // Cursor
    if (Math.floor(now / 380) % 2 === 0) {
      const lastLineY = termY + 12 + (this.state.codeBuffer.length - 1) * 10;
      const lastLine = this.state.codeBuffer[this.state.codeBuffer.length - 1] || "";
      const cursorX = termX + 6 + ctx.measureText(lastLine).width;
      if (lastLineY < termY + termH - 2) {
        ctx.fillStyle = "#4deeea";
        ctx.fillRect(cursorX, lastLineY - 7, 5, 8);
      }
    }
    ctx.restore();

    // 2C. BOTH HANDS ACTIVELY TYPING ON KEYBOARD (x: 0.35w to 0.55w, y: 0.65h to 0.85h)
    const leftHandX = w * 0.44;
    const leftHandY = h * 0.74 + (Math.sin(now * 0.02) > 0 ? 3 : 0);
    const rightHandX = w * 0.54;
    const rightHandY = h * 0.68 + (Math.cos(now * 0.022) > 0 ? 3 : 0);

    ctx.save();
    ctx.fillStyle = "#e8b898";
    // Left hand
    ctx.fillRect(leftHandX - 8, leftHandY - 4, 18, 10);
    ctx.fillRect(leftHandX - 6, leftHandY + 6, 3, 4);
    ctx.fillRect(leftHandX - 1, leftHandY + 7, 3, 5);
    ctx.fillRect(leftHandX + 4, leftHandY + 6, 3, 4);
    // Right hand
    ctx.fillRect(rightHandX - 8, rightHandY - 4, 18, 10);
    ctx.fillRect(rightHandX - 6, rightHandY + 6, 3, 4);
    ctx.fillRect(rightHandX - 1, rightHandY + 7, 3, 5);
    ctx.fillRect(rightHandX + 4, rightHandY + 6, 3, 4);

    // RGB Key flash
    const colors = ["#4deeea", "#ff416c", "#b388ff", "#38ef7d", "#ffaa42"];
    const keyColor = colors[Math.floor((now / 140) % colors.length)];
    ctx.fillStyle = keyColor;
    ctx.shadowColor = keyColor;
    ctx.shadowBlur = 8;
    ctx.fillRect(leftHandX - 4, leftHandY + 11, 7, 5);
    ctx.fillRect(rightHandX - 4, rightHandY + 11, 7, 5);
    ctx.restore();

    // 2D. Rain streaks outside window (x: 0.70w to 1.0w, y: 0.0w to 0.45h)
    const winX = w * 0.68;
    const winW = w * 0.32;
    const winH = h * 0.45;
    ctx.save();
    ctx.strokeStyle = "rgba(180, 210, 255, 0.35)";
    ctx.lineWidth = 1.2;
    this.state.windowRain.forEach(r => {
      r.y += r.speed;
      if (r.y > winH) { r.y = 0; r.x = Math.random() * winW; }
      ctx.beginPath();
      ctx.moveTo(winX + r.x, r.y);
      ctx.lineTo(winX + r.x - 2, r.y + r.length);
      ctx.stroke();
    });
    ctx.restore();

    // 2E. Gere Head Bob & Blink
    const isPlaying = window.lofiAudio && window.lofiAudio.isPlaying;
    const beatBob = isPlaying ? Math.sin(now * 0.0078) * 2.2 : 0;
    if (this.state.isBlinking) {
      ctx.fillStyle = "#1e1e2d";
      ctx.fillRect(w * 0.605, h * 0.36 + beatBob, 7, 2.5);
    }
  }

  // ==========================================================
  // 3. RIVERSIDE FOREST WALK ANIMATION
  // ==========================================================
  renderForestWalk(ctx, w, h, now) {
    // 3A. Flowing River Ripples
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 18; i++) {
      const rx = w * 0.48 + (Math.sin(now * 0.002 + i) * 0.12 + 0.12) * w;
      const ry = h * 0.52 + (i / 18) * (h * 0.42);
      const rippleWidth = 14 + Math.sin(now * 0.004 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(rx - rippleWidth, ry);
      ctx.lineTo(rx + rippleWidth, ry);
      ctx.stroke();
    }
    ctx.restore();

    // 3B. Swirling Autumn Leaves
    this.state.leaves.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      if (p.y > h || p.x < 0) {
        p.y = -10;
        p.x = Math.random() * w + 120;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    });

    // 3C. Gere Eye Blink
    if (this.state.isBlinking) {
      ctx.fillStyle = "#1e1e2d";
      ctx.fillRect(w * 0.345, h * 0.435, 7, 2.5);
      ctx.fillRect(w * 0.395, h * 0.435, 7, 2.5);
    }
  }

  // ==========================================================
  // 4. PANEL KITCHEN COOKING ANIMATION
  // ==========================================================
  renderPanelKitchen(ctx, w, h, now) {
    const s = this.state;
    const potX = w * 0.65;
    const potY = h * 0.75;

    // 4A. Hand Stirring Wooden Spoon in Pot
    const stirSpeed = now * 0.0035;
    const spoonX = potX + Math.cos(stirSpeed) * 14;
    const spoonY = potY + Math.sin(stirSpeed) * 7;

    ctx.save();
    const handX = w * 0.68;
    const handY = h * 0.66;
    ctx.strokeStyle = "#c8965a";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(spoonX, spoonY);
    ctx.stroke();

    ctx.fillStyle = "#b07c42";
    ctx.beginPath();
    ctx.ellipse(spoonX, spoonY, 6, 4, stirSpeed, 0, Math.PI * 2);
    ctx.fill();

    // 4B. Soup Bubbles Popping
    if (Math.random() < 0.25) {
      s.bubbles.push({
        x: potX + (Math.random() - 0.5) * 24,
        y: potY + (Math.random() - 0.5) * 8,
        radius: 1.5,
        maxRadius: 5 + Math.random() * 3,
        alpha: 0.8
      });
    }

    for (let i = s.bubbles.length - 1; i >= 0; i--) {
      const b = s.bubbles[i];
      b.radius += 0.2;
      b.alpha -= 0.02;
      ctx.strokeStyle = `rgba(255, 170, 50, ${Math.max(0, b.alpha)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.stroke();
      if (b.alpha <= 0 || b.radius >= b.maxRadius) s.bubbles.splice(i, 1);
    }

    // 4C. Thick Steam Waves
    if (Math.random() < 0.35) {
      s.kitchenSteam.push({
        x: spoonX + (Math.random() - 0.5) * 8,
        y: potY - 4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.8 + 0.5),
        size: 3,
        alpha: 0.4
      });
    }

    for (let i = s.kitchenSteam.length - 1; i >= 0; i--) {
      const st = s.kitchenSteam[i];
      st.x += st.vx;
      st.y += st.vy;
      st.size += 0.16;
      st.alpha -= 0.006;
      ctx.fillStyle = `rgba(255, 245, 230, ${Math.max(0, st.alpha)})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
      ctx.fill();
      if (st.alpha <= 0) s.kitchenSteam.splice(i, 1);
    }



    // 4E. Eye Blink
    if (s.isBlinking) {
      ctx.fillStyle = "#1e1e2d";
      ctx.fillRect(w * 0.596, h * 0.278, 7, 2.5);
      ctx.fillRect(w * 0.638, h * 0.278, 7, 2.5);
    }
    ctx.restore();
  }

  // ==========================================================
  // 5. PEACEFUL SLEEPING ANIMATION
  // ==========================================================
  renderSleeping(ctx, w, h, now) {
    const s = this.state;
    ctx.save();

    // 5A. Twinkling Stars & Skyline Window Lights (Window: x: 0.35w .. 0.72w, y: 0.10h .. 0.55h)
    this.state.stars.forEach(st => {
      const twinkle = (Math.sin(now * 0.003 + st.phase) + 1) * 0.4 + 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.fillRect(st.nx * w, st.ny * h, st.size, st.size);
    });

    // 5B. Floating "Zzz" Letters from Pillow on Bed (Left side: x: 0.11w, y: 0.68h)
    const headX = w * 0.11;
    const headY = h * 0.68;

    if (now - s.lastSleepZzzTime > 2000) {
      s.lastSleepZzzTime = now;
      s.sleepZzz.push({
        x: headX + (Math.random() - 0.5) * 8,
        y: headY - 6,
        size: Math.random() > 0.5 ? 12 : 9,
        text: Math.random() > 0.5 ? "Z" : "z",
        alpha: 0.85
      });
    }

    ctx.font = "bold 12px monospace";
    for (let i = s.sleepZzz.length - 1; i >= 0; i--) {
      const z = s.sleepZzz[i];
      z.y -= 0.5;
      z.x -= Math.sin(z.y * 0.06) * 0.35;
      z.alpha -= 0.004;
      ctx.fillStyle = `rgba(180, 210, 255, ${Math.max(0, z.alpha)})`;
      ctx.fillText(z.text, z.x, z.y);
      if (z.alpha <= 0) s.sleepZzz.splice(i, 1);
    }

    // 5C. Blanket Gentle Breathing Rise & Fall on Bed (Duvet: x: 0.20w, y: 0.75h)
    const breath = Math.sin(now * 0.002) * 2.5;
    ctx.fillStyle = "rgba(180, 30, 45, 0.18)";
    ctx.beginPath();
    ctx.ellipse(w * 0.20, h * 0.75 + breath, 52, 14, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // 5D. Vintage Amp Warm Tube Glow (Center: x: 0.44w, y: 0.66h)
    const ampGlow = (Math.sin(now * 0.004) + 1) * 0.15 + 0.45;
    ctx.fillStyle = `rgba(255, 175, 55, ${ampGlow * 0.35})`;
    ctx.beginPath();
    ctx.arc(w * 0.44, h * 0.66, 12, 0, Math.PI * 2);
    ctx.fill();

    // 5E. Fairy Lights Garland Twinkling (Right shelf/wall: x: 0.78w .. 0.94w)
    const garlandDots = [
      { x: 0.78, y: 0.23, color: "rgba(255, 230, 150," },
      { x: 0.82, y: 0.28, color: "rgba(120, 220, 255," },
      { x: 0.86, y: 0.31, color: "rgba(255, 160, 200," },
      { x: 0.90, y: 0.26, color: "rgba(150, 255, 180," },
      { x: 0.94, y: 0.21, color: "rgba(255, 220, 120," }
    ];
    garlandDots.forEach((d, idx) => {
      const gAlpha = (Math.sin(now * 0.0035 + idx * 1.3) + 1) * 0.35 + 0.3;
      ctx.fillStyle = `${d.color} ${gAlpha})`;
      ctx.beginPath();
      ctx.arc(d.x * w, d.y * h, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5F. Shimmering Night Dust Motes
    ctx.fillStyle = "rgba(190, 225, 255, 0.35)";
    for (let i = 0; i < 10; i++) {
      const mx = w * 0.40 + (Math.sin(now * 0.0008 + i * 1.5) * 0.18 + 0.18) * w;
      const my = h * 0.25 + (i / 10) * (h * 0.40);
      ctx.fillRect(mx, my, 2, 2);
    }

    ctx.restore();
  }
}

// Global instance
window.sceneFX = new SceneAnimationEngine();
