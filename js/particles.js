/**
 * GERE SZABADSÁGON - Professional Lo-Fi Atmospheric Animation Engine
 * 
 * High-quality ambient particle systems and dynamic lighting:
 * 1. DayZ Survival Gaming:
 *    - Soft hot tea steam with organic turbulence and alpha falloff
 *    - Survival monitor glow & game lighting flicker
 *    - Floating illuminated dust motes catching screen light in the dark room
 *    - Creeping atmospheric forest fog
 * 
 * 2. Dedicated Coding Scene:
 *    - Realistic window rain streaks with droplet trails outside the dark glass
 *    - Delicate curling coffee mug steam
 *    - Live coding IDE luminescence & scanline shimmer across monitors
 *    - Soft keyboard RGB ambient glow breathing onto desk
 * 
 * 3. Riverside Forest Walk:
 *    - Organic swirling autumn leaves (golden, russet, amber) tumbling in wind with natural leaf shape
 *    - Warm sunbeams / godrays shimmering through pine canopy
 *    - Flowing river water specular shimmer & undulating ripple highlights
 *    - Floating golden forest pollen drifting in sunbeams
 * 
 * 4. Panel Kitchen Cooking:
 *    - Voluminous warm steam clouds billowing from bubbling goulash pot
 *    - Gas burner flame glow with realistic blue/amber flicker under the pot
 *    - Simmering soup bubble pops with micro-splashes
 *    - Cozy evening twilight ambiance filtering from panel estate window
 */

class SceneAnimationEngine {
  constructor() {
    this.canvases = {};
    this.contexts = {};
    this.activeScene = "gaming";
    this.dpr = window.devicePixelRatio || 1;
    this.imgAspect = 1376 / 768;

    this.state = {
      // Scene 1: DayZ Gaming
      dayzSteam: [],
      dayzDust: [],
      dayzFog: [],

      // Scene 2: Coding
      codeRain: [],
      codeRainDrops: [],
      codeSteam: [],

      // Scene 3: Riverside Forest
      forestLeaves: [],
      forestRipples: [],
      forestPollen: [],

      // Scene 4: Panel Kitchen
      kitchenSteam: [],
      kitchenBubbles: []
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

  /**
   * Calculates the exact pixel bounding box of the 1376x768 image
   * as rendered by CSS `object-fit: cover` inside the current canvas.
   */
  getImageBounds(w, h) {
    const canvasAspect = w / h;
    let renderW, renderH, offsetX, offsetY;

    if (canvasAspect > this.imgAspect) {
      // Canvas is wider than image: width fits, top/bottom cropped
      renderW = w;
      renderH = w / this.imgAspect;
      offsetX = 0;
      offsetY = (h - renderH) / 2;
    } else {
      // Canvas is taller than image: height fits, left/right cropped
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

    // 1A. Dynamic Monitor Glow & Survival Lighting Breathing
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

    // 1B. Tea Mug Soft Steam (Mug at nx: 0.24, ny: 0.84)
    const mugX = this.toX(0.24, b);
    const mugY = this.toY(0.83, b);

    if (Math.random() < 0.22) {
      s.dayzSteam.push({
        x: mugX + (Math.random() - 0.5) * 6,
        y: mugY,
        radius: 3,
        maxRadius: 18 + Math.random() * 8,
        driftX: (Math.random() - 0.5) * 0.4,
        speedY: 0.7 + Math.random() * 0.5,
        alpha: 0.35,
        decay: 0.004 + Math.random() * 0.002
      });
    }

    this.renderSteamPuffs(ctx, s.dayzSteam, "rgba(220, 240, 255,");

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

    // 2A. Dual Monitor Glow & Live Coding Ambiance
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

    // 2B. Keyboard Ambient RGB Underglow (nx: 0.47, ny: 0.77)
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
      r.nx -= r.speed * 0.25; // slight wind slant
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

    // 2E. Coffee Mug Steam (Mug at nx: 0.24, ny: 0.84)
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

    // 3B. River Water Specular Highlights & Ripples (River: nx: 0.52..0.92, ny: 0.52..0.94)
    s.forestRipples.forEach(r => {
      r.nx -= r.speed; // water flow towards left/downstream
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

    // 3C. Swirling Autumn Leaves (Natural Leaf Path)
    s.forestLeaves.forEach(p => {
      // Wind gust simulation
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
      const aspectScale = Math.sin(p.tilt) * 0.6 + 0.4; // 3D tumble perspective

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(p.rotation);
      ctx.scale(1, aspectScale);
      ctx.fillStyle = p.color;

      // Draw organic pointed leaf shape
      ctx.beginPath();
      ctx.moveTo(-lsize * 0.5, 0);
      ctx.quadraticCurveTo(0, -lsize * 0.4, lsize * 0.5, 0);
      ctx.quadraticCurveTo(0, lsize * 0.4, -lsize * 0.5, 0);
      ctx.fill();

      // Delicate leaf center vein
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

    // 4A. Gas Stove Flame Glow under Pot (Stove at nx: 0.65, ny: 0.77)
    const stoveX = this.toX(0.65, b);
    const stoveY = this.toY(0.77, b);
    const flameRadius = this.toDist(0.08, b);
    const flameFlicker = Math.sin(now * 0.02) * 0.06 + Math.sin(now * 0.035) * 0.04;

    const flameGrad = ctx.createRadialGradient(stoveX, stoveY, 2, stoveX, stoveY, flameRadius);
    flameGrad.addColorStop(0, `rgba(77, 180, 255, ${0.45 + flameFlicker})`);
    flameGrad.addColorStop(0.4, `rgba(255, 160, 50, ${0.30 + flameFlicker})`);
    flameGrad.addColorStop(1, "rgba(255, 120, 30, 0)");

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.ellipse(stoveX, stoveY, flameRadius, flameRadius * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4B. Cozy Kitchen Ambient Warmth Pulse
    const ambientX = this.toX(0.65, b);
    const ambientY = this.toY(0.68, b);
    const ambientR = this.toDist(0.32, b);
    const warmPulse = Math.sin(now * 0.003) * 0.03;

    const ambGrad = ctx.createRadialGradient(ambientX, ambientY, 20, ambientX, ambientY, ambientR);
    ambGrad.addColorStop(0, `rgba(255, 170, 60, ${0.12 + warmPulse})`);
    ambGrad.addColorStop(1, "rgba(255, 140, 40, 0)");
    ctx.fillStyle = ambGrad;
    ctx.beginPath();
    ctx.arc(ambientX, ambientY, ambientR, 0, Math.PI * 2);
    ctx.fill();

    // 4C. Goulash Pot Steam (Pot mouth at nx: 0.65, ny: 0.71)
    const potX = this.toX(0.65, b);
    const potY = this.toY(0.71, b);

    if (Math.random() < 0.35) {
      s.kitchenSteam.push({
        x: potX + (Math.random() - 0.5) * 16,
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
