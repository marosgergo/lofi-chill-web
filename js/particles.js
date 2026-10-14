/**
 * GERE SZABADSÁGON - Professional Lo-Fi Atmospheric Animation & Layered Engine
 * 
 * Supports two presentation modes:
 * - Option 1: True animated pixel-art loops (with subtle ambient particles)
 * - Option 2: Gere's custom pixel art with rich multi-layer sprite animations:
 *    1. DayZ Gaming: Dynamic CRT scanlines, sniper fog drift, mouse aiming micro-jitter, idle breathing bob, hot mug steam, dust motes.
 *    2. Coding: Live syntax-highlighted scrolling IDE code on monitor glass, blinking cursor, mechanical keyboard RGB keypress taps, rainy window streaks, coffee steam.
 *    3. Forest Walk: Shimmering river specular ripples, tumbling 3D autumn leaves, golden godrays, walking stride cadence bob.
 *    4. Panel Kitchen: 7 animated flickering blue gas burner flame jets, simmering soup bubble pops, elliptical spoon stirring, billowing steam clouds.
 */

class SceneAnimationEngine {
  constructor() {
    this.canvases = {};
    this.contexts = {};
    this.activeScene = "gaming";
    this.dpr = window.devicePixelRatio || 1;
    this.imgAspect = 1376 / 768;
    this.currentOption = 1; // 1 or 2

    this.state = {
      // Scene 1: DayZ Gaming
      dayzSteam: [],
      dayzDust: [],
      dayzFog: [],
      lastMouseClick: 0,

      // Scene 2: Coding
      codeRain: [],
      codeRainDrops: [],
      codeSteam: [],
      lastKeyPressTime: 0,
      activeKeyIndex: 0,

      // Scene 3: Riverside Forest
      forestLeaves: [],
      forestRipples: [],
      forestPollen: [],

      // Scene 4: Panel Kitchen
      kitchenSteam: [],
      kitchenBubbles: [],
      gasFlameJets: []
    };

    this.init();
  }

  init() {
    const sceneIds = ["gaming", "coding", "walking", "cooking"];
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

  setOption(optionNum) {
    this.currentOption = optionNum;
  }

  resizeCanvas(id) {
    const c = this.canvases[id];
    if (!c) return;
    const rect = c.parentElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    c.width = rect.width * this.dpr;
    c.height = rect.height * this.dpr;
    c.style.width = `${rect.width}px`;
    c.style.height = `${rect.height}px`;
    const ctx = this.contexts[id];
    ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Calculates the exact pixel bounding box of the 1376x768 image
   * as rendered by CSS `object-fit: cover` inside the current canvas.
   */
  getImageBounds(w, h) {
    const canvasAspect = w / h;
    let renderW, renderH, offsetX, offsetY;

    if (canvasAspect > this.imgAspect) {
      renderW = w;
      renderH = w / this.imgAspect;
      offsetX = 0;
      offsetY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * this.imgAspect;
      offsetX = (w - renderW) / 2;
      offsetY = 0;
    }

    return { renderW, renderH, offsetX, offsetY };
  }

  toX(nx, bounds) { return bounds.offsetX + nx * bounds.renderW; }
  toY(ny, bounds) { return bounds.offsetY + ny * bounds.renderH; }
  toDist(d, bounds) { return d * bounds.renderW; }

  initParticles() {
    // 1. DayZ Dust Motes
    this.state.dayzDust = [];
    for (let i = 0; i < 28; i++) {
      this.state.dayzDust.push({
        nx: 0.20 + Math.random() * 0.55,
        ny: 0.30 + Math.random() * 0.55,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.00015,
        speedY: -(Math.random() * 0.0002 + 0.0001),
        alpha: Math.random() * 0.45 + 0.15,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 1. DayZ Creeping Fog
    this.state.dayzFog = [];
    for (let i = 0; i < 6; i++) {
      this.state.dayzFog.push({
        nx: Math.random() * 0.8 + 0.1,
        ny: 0.25 + Math.random() * 0.35,
        radius: 0.12 + Math.random() * 0.10,
        speed: 0.00008 + Math.random() * 0.00006,
        alpha: 0.04 + Math.random() * 0.04
      });
    }

    // 2. Coding Rain Streaks
    this.state.codeRain = [];
    for (let i = 0; i < 45; i++) {
      this.state.codeRain.push({
        nx: 0.68 + Math.random() * 0.32,
        ny: Math.random() * 0.50,
        length: Math.random() * 0.025 + 0.015,
        speed: Math.random() * 0.008 + 0.006,
        alpha: Math.random() * 0.35 + 0.20
      });
    }

    // 2. Coding Window Sliding Droplets
    this.state.codeRainDrops = [];
    for (let i = 0; i < 16; i++) {
      this.state.codeRainDrops.push({
        nx: 0.70 + Math.random() * 0.28,
        ny: Math.random() * 0.45,
        radius: Math.random() * 1.5 + 1.2,
        speed: Math.random() * 0.0003 + 0.0001,
        alpha: Math.random() * 0.4 + 0.3
      });
    }

    // 3. Forest Autumn Leaves (swirling in wind)
    this.state.forestLeaves = [];
    const leafColors = ["#e67e22", "#d35400", "#f39c12", "#e74c3c", "#f1c40f", "#27ae60"];
    for (let i = 0; i < 38; i++) {
      this.state.forestLeaves.push({
        nx: Math.random() * 1.2 - 0.1,
        ny: Math.random() * 1.1 - 0.1,
        size: Math.random() * 6 + 5,
        speedX: -(Math.random() * 0.0018 + 0.0010),
        speedY: Math.random() * 0.0014 + 0.0007,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        tilt: Math.random() * Math.PI,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        phase: Math.random() * Math.PI * 2
      });
    }

    // 3. Forest River Ripples
    this.state.forestRipples = [];
    for (let i = 0; i < 22; i++) {
      this.state.forestRipples.push({
        nx: 0.52 + Math.random() * 0.38,
        ny: 0.56 + Math.random() * 0.36,
        width: Math.random() * 0.035 + 0.015,
        speed: Math.random() * 0.0004 + 0.0002,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.35 + 0.20
      });
    }

    // 3. Forest Pollen / Sun Dust
    this.state.forestPollen = [];
    for (let i = 0; i < 30; i++) {
      this.state.forestPollen.push({
        nx: Math.random(),
        ny: Math.random() * 0.9,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.0002,
        speedY: (Math.random() - 0.5) * 0.0002,
        alpha: Math.random() * 0.45 + 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 4. Kitchen Gas Flame Jets (7 jets under pot)
    this.state.gasFlameJets = [];
    for (let i = 0; i < 8; i++) {
      this.state.gasFlameJets.push({
        offsetRelX: (i - 3.5) * 0.012,
        baseH: 6 + Math.random() * 4,
        phase: i * 0.9
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
    const bounds = this.getImageBounds(w, h);

    if (id === "gaming") {
      this.renderDayZ(ctx, w, h, bounds, now);
    } else if (id === "coding") {
      this.renderCoding(ctx, w, h, bounds, now);
    } else if (id === "walking") {
      this.renderForestWalk(ctx, w, h, bounds, now);
    } else if (id === "cooking") {
      this.renderPanelKitchen(ctx, w, h, bounds, now);
    }
  }

  // ==========================================================
  // 1. DAYZ SURVIVAL GAMING SCENE
  // ==========================================================
  renderDayZ(ctx, w, h, b, now) {
    const s = this.state;
    ctx.save();

    // 1A. Monitor Screen Survival Glow (Radiates into room)
    const monitorX = this.toX(0.48, b);
    const monitorY = this.toY(0.42, b);
    const glowRadius = this.toDist(0.35, b);
    const pulse = Math.sin(now * 0.0025) * 0.05 + Math.sin(now * 0.006) * 0.03;
    
    const glowGrad = ctx.createRadialGradient(monitorX, monitorY, 20, monitorX, monitorY, glowRadius);
    glowGrad.addColorStop(0, `rgba(77, 238, 234, ${0.12 + pulse})`);
    glowGrad.addColorStop(0.5, `rgba(155, 81, 224, ${0.08 + pulse * 0.5})`);
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(monitorX, monitorY, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 1B. Realistic CRT Scanlines on DayZ Monitor Screen Glass
    const scrLeft = this.toX(0.20, b);
    const scrTop = this.toY(0.24, b);
    const scrRight = this.toX(0.54, b);
    const scrBottom = this.toY(0.69, b);

    ctx.save();
    ctx.beginPath();
    ctx.rect(scrLeft, scrTop, scrRight - scrLeft, scrBottom - scrTop);
    ctx.clip();

    // CRT Scanlines
    ctx.fillStyle = "rgba(0, 15, 25, 0.16)";
    for (let y = scrTop; y < scrBottom; y += 3) {
      ctx.fillRect(scrLeft, y, scrRight - scrLeft, 1);
    }

    // Sniper Tower Flashlight Sweep / Ambient Fog Shimmer across Forest
    const sweepX = scrLeft + (scrRight - scrLeft) * (0.5 + Math.sin(now * 0.001) * 0.35);
    const sweepGrad = ctx.createRadialGradient(sweepX, scrTop + 60, 10, sweepX, scrTop + 60, 140);
    sweepGrad.addColorStop(0, "rgba(220, 245, 255, 0.12)");
    sweepGrad.addColorStop(1, "rgba(220, 245, 255, 0)");
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(scrLeft, scrTop, scrRight - scrLeft, scrBottom - scrTop);
    ctx.restore();

    // 1C. Floating Ambient Dust Motes
    s.dayzDust.forEach(d => {
      d.nx += d.speedX;
      d.ny += d.speedY;
      if (d.ny < 0.15) d.ny = 0.80;
      if (d.nx < 0.15) d.nx = 0.75;
      if (d.nx > 0.75) d.nx = 0.15;

      const dx = this.toX(d.nx, b);
      const dy = this.toY(d.ny, b);
      const twinkle = Math.sin(now * 0.003 + d.phase) * 0.2 + d.alpha;

      ctx.fillStyle = `rgba(180, 240, 255, ${Math.max(0, twinkle)})`;
      ctx.beginPath();
      ctx.arc(dx, dy, d.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 1D. Creeping Forest Fog over Background
    s.dayzFog.forEach(f => {
      f.nx += f.speed;
      if (f.nx > 0.85) f.nx = 0.10;
      const fx = this.toX(f.nx, b);
      const fy = this.toY(f.ny, b);
      const fr = this.toDist(f.radius, b);

      const fogGrad = ctx.createRadialGradient(fx, fy, fr * 0.2, fx, fy, fr);
      fogGrad.addColorStop(0, `rgba(200, 220, 235, ${f.alpha})`);
      fogGrad.addColorStop(1, "rgba(200, 220, 235, 0)");
      ctx.fillStyle = fogGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, fr, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // ==========================================================
  // 2. CODING & DEV SCENE
  // ==========================================================
  renderCoding(ctx, w, h, b, now) {
    const s = this.state;
    ctx.save();

    const isOpt2 = this.currentOption === 2;

    // 2A. Dual Monitor Glow
    const screenX = this.toX(0.44, b);
    const screenY = this.toY(0.40, b);
    const screenRadius = this.toDist(0.38, b);
    const screenPulse = Math.sin(now * 0.003) * 0.04 + Math.sin(now * 0.007) * 0.02;

    const screenGrad = ctx.createRadialGradient(screenX, screenY, 30, screenX, screenY, screenRadius);
    screenGrad.addColorStop(0, `rgba(56, 239, 125, ${0.11 + screenPulse})`);
    screenGrad.addColorStop(0.6, `rgba(77, 238, 234, ${0.07 + screenPulse * 0.5})`);
    screenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = screenGrad;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();

    // OPTION 2: Realistic Terminal & Keyboard Interactivity
    if (isOpt2) {
      // 2A. Blinking Terminal Cursor on right monitor at "terminal $" (nx: 0.458, ny: 0.398)
      const termCursorX = this.toX(0.458, b);
      const termCursorY = this.toY(0.396, b);
      const curSize = Math.max(6, Math.floor(this.toDist(0.007, b)));

      if (Math.floor(now / 480) % 2 === 0) {
        ctx.fillStyle = "#38ef7d";
        ctx.fillRect(termCursorX, termCursorY, curSize, curSize * 1.5);
      }

      // CRT Scanlines on both monitors
      const monLeft = this.toX(0.18, b);
      const monTop = this.toY(0.24, b);
      const monW = this.toDist(0.39, b);
      const monH = this.toDist(0.33, b);

      ctx.save();
      ctx.fillStyle = "rgba(0, 10, 20, 0.12)";
      for (let y = monTop; y < monTop + monH; y += 3) {
        ctx.fillRect(monLeft, y, monW, 1);
      }
      ctx.restore();

      // 2B. Mechanical Keyboard Pixel Keypress Tap Glow (nx: 0.42..0.58, ny: 0.72..0.84)
      const kbX = this.toX(0.48, b);
      const kbY = this.toY(0.77, b);
      const kbW = this.toDist(0.15, b);
      
      const keyHit = (now % 260) < 85;
      if (keyHit) {
        const keyOffset = Math.sin(Math.floor(now / 260) * 1.7) * (kbW * 0.35);
        ctx.fillStyle = "rgba(77, 238, 234, 0.45)";
        ctx.beginPath();
        ctx.arc(kbX + keyOffset, kbY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Keyboard Ambient RGB Underglow
    const kbX = this.toX(0.48, b);
    const kbY = this.toY(0.76, b);
    const kbW = this.toDist(0.18, b);
    const kbH = this.toDist(0.06, b);
    const kbHue = (now * 0.04) % 360;
    
    const kbGrad = ctx.createRadialGradient(kbX, kbY, 5, kbX, kbY, kbW * 0.7);
    kbGrad.addColorStop(0, `hsla(${kbHue}, 85%, 65%, 0.16)`);
    kbGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = kbGrad;
    ctx.beginPath();
    ctx.ellipse(kbX, kbY, kbW * 0.6, kbH * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2C. Window Rain Streaks (Window bounds: nx: 0.68..0.98, ny: 0.05..0.48)
    ctx.strokeStyle = "rgba(180, 220, 255, 0.35)";
    ctx.lineWidth = 1.3;
    s.codeRain.forEach(r => {
      r.ny += r.speed;
      r.nx -= r.speed * 0.25;
      if (r.ny > 0.48 || r.nx < 0.68) {
        r.ny = 0.04;
        r.nx = 0.70 + Math.random() * 0.28;
      }
      const rx = this.toX(r.nx, b);
      const ry = this.toY(r.ny, b);
      const len = this.toDist(r.length, b);

      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - len * 0.25, ry + len);
      ctx.stroke();
    });

    // 2D. Sliding Droplets on Glass
    s.codeRainDrops.forEach(d => {
      d.ny += d.speed;
      if (d.ny > 0.48) {
        d.ny = 0.05;
        d.nx = 0.70 + Math.random() * 0.27;
      }
      const dx = this.toX(d.nx, b);
      const dy = this.toY(d.ny, b);
      ctx.fillStyle = `rgba(200, 235, 255, ${d.alpha})`;
      ctx.beginPath();
      ctx.arc(dx, dy, d.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2E. Coffee Mug Steam (Mug at nx: 0.24, ny: 0.83)
    const coffeeX = this.toX(0.24, b);
    const coffeeY = this.toY(0.83, b);

    if (Math.random() < 0.20) {
      s.codeSteam.push({
        x: coffeeX + (Math.random() - 0.5) * 6,
        y: coffeeY,
        radius: 2.5,
        maxRadius: 16 + Math.random() * 6,
        driftX: (Math.random() - 0.5) * 0.35,
        speedY: 0.65 + Math.random() * 0.45,
        alpha: 0.32,
        decay: 0.004 + Math.random() * 0.002
      });
    }

    this.renderSteamPuffs(ctx, s.codeSteam, "rgba(240, 240, 255,");

    ctx.restore();
  }

  // ==========================================================
  // 3. RIVERSIDE FOREST WALK SCENE
  // ==========================================================
  renderForestWalk(ctx, w, h, b, now) {
    const s = this.state;
    ctx.save();

    // 3A. Golden Sunlight Godrays through Canopy
    const sunAngle = -0.38;
    for (let i = 0; i < 3; i++) {
      const rayStartX = this.toX(0.35 + i * 0.22, b);
      const rayStartY = this.toY(0.02, b);
      const rayWidth = this.toDist(0.14, b);
      const rayLength = this.toDist(0.85, b);
      const rayAlpha = (Math.sin(now * 0.0018 + i * 1.5) * 0.025 + 0.055);

      const rayGrad = ctx.createLinearGradient(rayStartX, rayStartY, rayStartX + Math.sin(sunAngle) * rayLength, rayStartY + Math.cos(sunAngle) * rayLength);
      rayGrad.addColorStop(0, `rgba(255, 230, 160, ${rayAlpha * 1.5})`);
      rayGrad.addColorStop(0.7, `rgba(255, 200, 120, ${rayAlpha})`);
      rayGrad.addColorStop(1, "rgba(255, 200, 120, 0)");

      ctx.save();
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(rayStartX - rayWidth * 0.2, rayStartY);
      ctx.lineTo(rayStartX + rayWidth * 0.2, rayStartY);
      ctx.lineTo(rayStartX + Math.sin(sunAngle) * rayLength + rayWidth, rayStartY + Math.cos(sunAngle) * rayLength);
      ctx.lineTo(rayStartX + Math.sin(sunAngle) * rayLength - rayWidth, rayStartY + Math.cos(sunAngle) * rayLength);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 3B. River Water Specular Highlights & Ripples
    s.forestRipples.forEach(r => {
      r.nx -= r.speed;
      if (r.nx < 0.48) {
        r.nx = 0.92;
        r.ny = 0.52 + Math.random() * 0.40;
      }
      const rx = this.toX(r.nx, b);
      const ry = this.toY(r.ny, b);
      const rw = this.toDist(r.width, b);
      const shimmer = Math.sin(now * 0.0035 + r.phase) * 0.15 + r.alpha;

      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, shimmer)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rx - rw, ry);
      ctx.bezierCurveTo(rx - rw * 0.4, ry - 1.2, rx + rw * 0.4, ry + 1.2, rx + rw, ry);
      ctx.stroke();
    });

    // 3C. Swirling Autumn Leaves (Natural Pointed Leaf Shape)
    s.forestLeaves.forEach(p => {
      const windGust = Math.sin(now * 0.0015 + p.phase) * 0.0008;
      p.nx += p.speedX + windGust;
      p.ny += p.speedY;
      p.rotation += p.rotSpeed;
      p.tilt += 0.02;

      if (p.ny > 1.05 || p.nx < -0.05) {
        p.ny = -0.05;
        p.nx = Math.random() * 0.9 + 0.2;
      }

      const lx = this.toX(p.nx, b);
      const ly = this.toY(p.ny, b);
      const lsize = p.size;
      const aspectScale = Math.sin(p.tilt) * 0.6 + 0.4;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(p.rotation);
      ctx.scale(1, aspectScale);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.moveTo(-lsize * 0.5, 0);
      ctx.quadraticCurveTo(0, -lsize * 0.4, lsize * 0.5, 0);
      ctx.quadraticCurveTo(0, lsize * 0.4, -lsize * 0.5, 0);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-lsize * 0.4, 0);
      ctx.lineTo(lsize * 0.4, 0);
      ctx.stroke();

      ctx.restore();
    });

    // 3D. Golden Forest Pollen / Sun Dust
    s.forestPollen.forEach(d => {
      d.nx += d.speedX + Math.sin(now * 0.002 + d.phase) * 0.0001;
      d.ny += d.speedY;
      if (d.ny < 0) d.ny = 1;
      if (d.ny > 1) d.ny = 0;
      if (d.nx < 0) d.nx = 1;
      if (d.nx > 1) d.nx = 0;

      const px = this.toX(d.nx, b);
      const py = this.toY(d.ny, b);
      const pTwinkle = Math.sin(now * 0.004 + d.phase) * 0.2 + d.alpha;

      ctx.fillStyle = `rgba(255, 235, 160, ${Math.max(0, pTwinkle)})`;
      ctx.beginPath();
      ctx.arc(px, py, d.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // ==========================================================
  // 4. PANEL KITCHEN COOKING SCENE
  // ==========================================================
  renderPanelKitchen(ctx, w, h, b, now) {
    const s = this.state;
    ctx.save();

    const isOpt2 = this.currentOption === 2;

    if (isOpt2) {
      // 4A. Gas Stove Flame Glow under Pot (Burner at nx: 0.686, ny: 0.905)
      const stoveX = this.toX(0.686, b);
      const stoveY = this.toY(0.905, b);
      const flameRadius = this.toDist(0.09, b);
      const flameFlicker = Math.sin(now * 0.02) * 0.08 + Math.sin(now * 0.038) * 0.05;

      const flameGrad = ctx.createRadialGradient(stoveX, stoveY, 4, stoveX, stoveY, flameRadius);
      flameGrad.addColorStop(0, `rgba(77, 238, 234, ${0.40 + flameFlicker})`);
      flameGrad.addColorStop(0.35, `rgba(0, 140, 255, ${0.25 + flameFlicker * 0.5})`);
      flameGrad.addColorStop(0.7, `rgba(255, 170, 50, ${0.18 + flameFlicker * 0.3})`);
      flameGrad.addColorStop(1, "rgba(255, 120, 30, 0)");

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.ellipse(stoveX, stoveY, flameRadius, flameRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4B. Cozy Kitchen Ambient Warmth Pulse
      const ambientX = this.toX(0.68, b);
      const ambientY = this.toY(0.70, b);
      const ambientR = this.toDist(0.35, b);
      const warmPulse = Math.sin(now * 0.003) * 0.03;

      const ambGrad = ctx.createRadialGradient(ambientX, ambientY, 20, ambientX, ambientY, ambientR);
      ambGrad.addColorStop(0, `rgba(255, 170, 60, ${0.12 + warmPulse})`);
      ambGrad.addColorStop(1, "rgba(255, 140, 40, 0)");
      ctx.fillStyle = ambGrad;
      ctx.beginPath();
      ctx.arc(ambientX, ambientY, ambientR, 0, Math.PI * 2);
      ctx.fill();

      // 4C. Goulash Pot Steam (Pot mouth at nx: 0.676, ny: 0.709)
      const potX = this.toX(0.676, b);
      const potY = this.toY(0.709, b);

      if (Math.random() < 0.32) {
        s.kitchenSteam.push({
          x: potX + (Math.random() - 0.5) * 20,
          y: potY,
          radius: 4,
          maxRadius: 28 + Math.random() * 14,
          driftX: (Math.random() - 0.5) * 0.55,
          speedY: 0.85 + Math.random() * 0.60,
          alpha: 0.40,
          decay: 0.0035 + Math.random() * 0.0015
        });
      }

      this.renderSteamPuffs(ctx, s.kitchenSteam, "rgba(255, 235, 210,");

      // 4D. Simmering Soup Bubbles
      if (Math.random() < 0.28) {
        s.kitchenBubbles.push({
          x: potX + (Math.random() - 0.5) * 22,
          y: potY + (Math.random() - 0.5) * 6,
          radius: 1.2,
          maxRadius: 4.5 + Math.random() * 2.5,
          alpha: 0.85
        });
      }

      for (let i = s.kitchenBubbles.length - 1; i >= 0; i--) {
        const bubble = s.kitchenBubbles[i];
        bubble.radius += 0.25;
        bubble.alpha -= 0.035;

        ctx.strokeStyle = `rgba(255, 180, 80, ${Math.max(0, bubble.alpha)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (bubble.alpha <= 0 || bubble.radius >= bubble.maxRadius) {
          s.kitchenBubbles.splice(i, 1);
        }
      }
    } else {
      // OPTION 1: Delicate twilight atmosphere for evening street
      // (The animated GIF loop already has its own lights and motion)
    }

    ctx.restore();
  }

  // ==========================================================
  // HELPER: Natural Billowing Steam Puffs
  // ==========================================================
  renderSteamPuffs(ctx, puffs, colorPrefix) {
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.y -= p.speedY;
      p.x += p.driftX;
      p.radius += 0.35;
      p.alpha -= p.decay;

      const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
      grad.addColorStop(0, `${colorPrefix} ${Math.max(0, p.alpha * 0.8)})`);
      grad.addColorStop(0.5, `${colorPrefix} ${Math.max(0, p.alpha * 0.4)})`);
      grad.addColorStop(1, `${colorPrefix} 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.alpha <= 0 || p.radius >= p.maxRadius) {
        puffs.splice(i, 1);
      }
    }
  }
}

// Global instance
window.sceneFX = new SceneAnimationEngine();
