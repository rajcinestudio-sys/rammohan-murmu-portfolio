/**
 * Main Frontend Logic & 3D Interactive Controller (v3.0)
 * Rammohan Murmu Portfolio
 */

let currentMainCategory = "all";
let currentSubCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initBackgroundCanvas();
  initCustomCursor();
  initTypingEffect();
  renderAllPortfolioContent();
  initMobileDockObserver();
  initScrollHeader();

  // Listen for real-time changes from Admin CMS (same tab and cross-tab)
  window.addEventListener("portfolioDataChanged", () => {
    renderAllPortfolioContent();
  });
  window.addEventListener("storage", () => {
    renderAllPortfolioContent();
  });
});

/* ==========================================================================
   1. SPLASH SCREEN / PRELOADER CONTROLLER (100% LOADING)
   ========================================================================== */
function initSplashScreen() {
  const splash = document.getElementById("splash-screen");
  const bar = document.getElementById("splash-progress-bar");
  const counter = document.getElementById("splash-counter");
  if (!splash) return;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      if (bar) bar.style.width = "100%";
      if (counter) counter.textContent = "100%";

      setTimeout(() => {
        splash.classList.add("splash-hidden");
        document.body.classList.remove("splash-locked");
      }, 400);
    } else {
      if (bar) bar.style.width = progress + "%";
      if (counter) counter.textContent = progress + "%";
    }
  }, 35);
}

/* ==========================================================================
   2. INTERACTIVE 3D CANVAS BACKGROUND (PARTICLE CONSTELLATION)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.5 ? "rgba(139, 92, 246, 0.7)" : "rgba(6, 182, 212, 0.7)";
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let dirX = (dx / dist) * force * 3;
          let dirY = (dy / dist) * force * 3;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          let opacity = 1 - dist / 120;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   3. CUSTOM DUAL-LAYER CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursor-dot");
  if (!cursor || !dot || window.innerWidth < 992) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states for interactive elements
  const interactives = document.querySelectorAll("a, button, .project-card, .service-card, input, textarea, select");
  interactives.forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });
}

/* ==========================================================================
   4. TYPING TEXT ANIMATION
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById("hero-typing-target");
  if (!target) return;

  const words = [
    "Graphics & Brand Designer",
    "YouTube Viral Thumbnails",
    "Cinematic Video Editor",
    "Figma UI/UX Specialist",
    "Modern 3D Web Designer"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      speed = 40;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      speed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      speed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }
  type();
}

/* ==========================================================================
   5. RENDER ALL PORTFOLIO CONTENT FROM DATA ENGINE
   ========================================================================== */
function renderAllPortfolioContent() {
  if (!window.PortfolioData) return;
  const data = window.PortfolioData.get();

  // 1. Profile & Bio Details
  if (data.profile) {
    const p = data.profile;
    setText("nav-profile-name", p.name.split(" ")[0]);
    setText("hero-name-highlight", p.name);
    setText("hero-tagline-desc", p.tagline);
    setText("stat-exp", p.yearsExp || "3+");
    setText("stat-projects", p.projectsDone || "85+");
    setText("stat-clients", p.clientSatisfaction || "99%");
    setText("about-fullbio", p.fullBio);
    setText("about-location", p.location || "West Bengal, India");
    setText("about-exp", (p.yearsExp || "3+") + " Years Professional");
    setText("about-exp-number", (p.yearsExp || "3+") + " Years");
    setText("about-stat-projects", p.projectsDone || "85+");
    setText("about-stat-clients", p.happyClients || "60+");
    setText("about-stat-satisfaction", p.clientSatisfaction || "99%");

    const aboutImgEl = document.getElementById("about-profile-img");
    if (aboutImgEl) {
      aboutImgEl.src = p.aboutImage || p.avatar || "assets/images/avatar.svg";
    }
    
    // Contact & Footer Links
    setText("contact-phone-link", p.displayPhone || "+91 8250550062");
    setText("contact-wa-link", p.displayWhatsapp || "+91 8250550060");
    setText("contact-email-link", p.email || "rammohanmurmu0@gmail.com");

    setText("footer-phone", p.displayPhone || "+91 8250550062");
    setText("footer-wa", p.displayWhatsapp || "+91 8250550060");
    setText("footer-email", p.email || "rammohanmurmu0@gmail.com");
    setText("footer-bio-tag", p.tagline);

    // Social Links in Footer
    renderSocialLinks(p.socials, p.customSocials);
  }

  // 2. Services
  renderServices(data.services || []);

  // 3. Portfolio Categories, Subfilters & Projects
  initPortfolioFilters(data.projects || []);

  // 4. Hero Works 3D Slider
  initHeroWorksSlider(data.projects || []);

  // 5. Skills
  renderSkills(data.skills || []);

  // 6. Testimonials
  renderTestimonials(data.testimonials || []);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

let serviceSliderTimers = [];

// Render Services (Matching 3D cards with 16:9 Showcase Banner & Auto-Slider)
function renderServices(services) {
  const container = document.getElementById("services-container");
  if (!container) return;

  // Clear existing timers
  serviceSliderTimers.forEach(t => clearInterval(t));
  serviceSliderTimers = [];

  container.innerHTML = services.map((s, sIndex) => {
    const badgeText = s.badge || (s.theme === "gold" ? "Mastery" : s.theme === "cyan" ? "Advanced" : "Specialist");
    const ribbonHtml = s.ribbon ? `<div class="service-ribbon">${s.ribbon}</div>` : "";

    const images = Array.isArray(s.images) && s.images.length > 0 
      ? s.images 
      : (s.image ? [s.image] : ["assets/images/project_apex_branding.svg"]);

    const isSlider = images.length > 1;

    const bannerHtml = `
      <div class="service-card-banner-box" id="service-banner-box-${s.id || sIndex}">
        ${images.map((img, imgIdx) => `
          <div class="service-card-slide service-slide-${s.id || sIndex} ${imgIdx === 0 ? 'active' : ''}">
            <img src="${img}" alt="${s.title}" onerror="this.src='assets/images/hero_banner.jpg'">
          </div>
        `).join("")}
        <div class="service-card-banner-overlay"></div>
        ${isSlider ? `
          <div class="service-card-slider-dots" id="service-dots-${s.id || sIndex}">
            ${images.map((_, dotIdx) => `
              <div class="service-card-slider-dot ${dotIdx === 0 ? 'active' : ''}"></div>
            `).join("")}
          </div>
        ` : ''}
      </div>
    `;

    return `
      <div class="service-card theme-${s.theme || 'gold'}">
        ${ribbonHtml}
        <div>
          ${bannerHtml}

          <div class="service-card-top">
            <div class="service-icon-box ${s.theme || 'gold'}">
              ${s.icon === 'pen-tool' ? '✒️' : s.icon === 'ui-layout' ? '💻' : '🎬'}
            </div>
            <span class="service-badge-pill ${s.theme || 'gold'}">${badgeText}</span>
          </div>

          <h3 class="service-title">${s.title}</h3>
          <p class="service-desc">${s.shortDesc}</p>

          <div class="service-feature-chips">
            ${(s.features || []).map(f => `<span class="feature-tag-chip">${f}</span>`).join("")}
          </div>

          <div class="service-tools-row">
            ${(s.tools || []).map(t => `
              <span class="tool-dot-pill">
                <span class="tool-dot" style="background: ${t.color || '#fff'}; box-shadow: 0 0 6px ${t.color || '#fff'};"></span>
                ${t.name}
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Initialize auto-sliding intervals and touch/mouse swipe for services with 2+ images
  services.forEach((s, sIndex) => {
    const sId = s.id || sIndex;
    const images = Array.isArray(s.images) && s.images.length > 0 ? s.images : (s.image ? [s.image] : []);
    if (images.length > 1) {
      let currentIndex = 0;
      const slides = document.querySelectorAll(`.service-slide-${sId}`);
      const dotsContainer = document.getElementById(`service-dots-${sId}`);
      const dots = dotsContainer ? dotsContainer.querySelectorAll(".service-card-slider-dot") : [];
      const bannerBox = document.getElementById(`service-banner-box-${sId}`);

      function updateServiceSlide(newIdx) {
        currentIndex = newIdx;
        slides.forEach((sl, idx) => {
          if (idx === currentIndex) sl.classList.add("active");
          else sl.classList.remove("active");
        });
        dots.forEach((dt, idx) => {
          if (idx === currentIndex) dt.classList.add("active");
          else dt.classList.remove("active");
        });
      }

      function nextServiceSlide() {
        updateServiceSlide((currentIndex + 1) % images.length);
      }

      function prevServiceSlide() {
        updateServiceSlide((currentIndex - 1 + images.length) % images.length);
      }

      const timer = setInterval(nextServiceSlide, 3500 + (sIndex * 400));
      serviceSliderTimers.push(timer);

      // Attach Finger Touch & Mouse Drag to Slide
      if (bannerBox) {
        attachSwipeGesture(bannerBox, nextServiceSlide, prevServiceSlide);
      }
    }
  });
}

/* ==========================================================================
   6. PORTFOLIO & DYNAMIC SUBCATEGORY FILTERING SYSTEM
   ========================================================================== */
function initPortfolioFilters(projects) {
  const mainFilterBtns = document.querySelectorAll("#portfolio-main-filters .filter-btn");
  
  mainFilterBtns.forEach(btn => {
    btn.onclick = () => {
      mainFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMainCategory = btn.getAttribute("data-category") || btn.getAttribute("data-filter") || "all";
      currentSubCategory = "all";
      renderSubFilters(currentMainCategory);
      renderProjects(projects);
    };
  });

  renderSubFilters(currentMainCategory);
  renderProjects(projects);
}

function renderSubFilters(mainCategory) {
  const container = document.getElementById("portfolio-subfilters");
  if (!container) return;

  const categories = window.PortfolioData.getCategories();

  if (mainCategory === "all") {
    container.innerHTML = `
      <button class="subfilter-chip active" onclick="setSubCategory('all', this)">✨ All Categories</button>
      <button class="subfilter-chip" onclick="setSubCategory('thumbnail', this)">📺 YouTube Thumbnails</button>
      <button class="subfilter-chip" onclick="setSubCategory('poster', this)">🖼️ Posters &amp; Flex</button>
      <button class="subfilter-chip" onclick="setSubCategory('logo', this)">✨ Logos &amp; Branding</button>
      <button class="subfilter-chip" onclick="setSubCategory('teaser_trailer', this)">🎬 Teasers &amp; Cinematic</button>
      <button class="subfilter-chip" onclick="setSubCategory('mobile_app', this)">📱 Mobile Apps (Figma)</button>
    `;
    return;
  }

  const categoryObj = categories[mainCategory];
  if (!categoryObj || !Array.isArray(categoryObj.subCategories)) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = categoryObj.subCategories.map(sub => `
    <button class="subfilter-chip ${currentSubCategory === sub.id ? 'active' : ''}" onclick="setSubCategory('${sub.id}', this)">
      ${sub.name}
    </button>
  `).join("");
}

window.setSubCategory = function(subId, el) {
  currentSubCategory = subId;
  const chips = document.querySelectorAll("#portfolio-subfilters .subfilter-chip");
  chips.forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");

  const projects = window.PortfolioData.getProjects();
  renderProjects(projects);
};

function renderProjects(projects) {
  const container = document.getElementById("portfolio-grid");
  if (!container) return;

  let filtered = projects;

  // Filter by Main Category
  if (currentMainCategory !== "all") {
    filtered = filtered.filter(p => p.category === currentMainCategory);
  }

  // Filter by Subcategory
  if (currentSubCategory !== "all") {
    filtered = filtered.filter(p => p.subCategory === currentSubCategory);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">No projects found in this specific subcategory.</p>
        <p style="font-size: 0.9rem;">Try selecting "All" or explore other categories!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const revCount = (p.reviews || []).length;
    const avgRating = revCount > 0 
      ? (p.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / revCount).toFixed(1)
      : "5.0";

    const badgeLabel = p.subCategoryName || p.categoryName || "Work";

    return `
      <div class="project-card" onclick="openProjectModal('${p.id}')">
        <div class="project-thumb-box">
          <span class="project-badge-tag">${badgeLabel}</span>
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <div class="project-overlay">
            <div class="overlay-btn">👁️</div>
            <span style="font-weight: 700; font-size: 0.95rem; color: #fff;">View Project</span>
          </div>
        </div>
        <div class="project-info">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
              <h3 class="project-title" style="margin-bottom:0;">${p.title}</h3>
              <span style="font-size: 0.8rem; color: #fbbf24; font-weight: 700;">★ ${avgRating}</span>
            </div>
            <p class="project-short-desc">${p.description}</p>
          </div>
          <div class="project-tags">
            ${(p.tags || []).slice(0, 3).map(tag => `<span class="project-tag-pill">${tag}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   7. DYNAMIC HERO WORKS & 16:9 BANNER AUTO-SLIDER (DESKTOP & MOBILE WITH TOUCH/MOUSE SWIPE)
   ========================================================================== */
let heroSliderTimer = null;

function initHeroWorksSlider(projects) {
  const desktopContainer = document.getElementById("hero-desktop-slides-wrapper");
  const desktopCard = document.getElementById("hero-desktop-slider-card");
  const desktopDots = document.getElementById("hero-desktop-nav-dots");
  const mobileContainer = document.getElementById("hero-mobile-16x9-track");
  const mobileDots = document.getElementById("hero-mobile-nav-dots");

  if (!desktopContainer && !mobileContainer) return;

  const featuredProjects = (projects || []).filter(p => p.featured === true);
  let slideItems = featuredProjects.length > 0 ? featuredProjects : (projects || []).slice(0, 4);

  if (slideItems.length === 0) {
    slideItems = [{
      id: "srv-showcase",
      title: "Rammohan Murmu Creative Workstation",
      categoryName: "Featured Studio",
      image: "assets/images/hero_banner.jpg"
    }];
  }

  let currentSlide = 0;

  // Render Desktop Slides
  if (desktopContainer) {
    desktopContainer.innerHTML = slideItems.map((p, i) => {
      const imgSrc = p.image || "assets/images/hero_banner.jpg";
      return `
        <div class="hero-desktop-slide ${i === 0 ? 'active' : ''}" onclick="openProjectModal('${p.id}')">
          <img src="${imgSrc}" alt="${p.title}" onerror="this.src='assets/images/hero_banner.jpg'">
          <div class="hero-slide-overlay">
            <div>
              <div class="hero-slide-category">${p.subCategoryName || p.categoryName || 'Featured Work'}</div>
              <div class="hero-slide-title">${p.title}</div>
            </div>
            <span class="hero-slide-badge-btn">👁️ View Details</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // Render Desktop Dots
  if (desktopDots) {
    desktopDots.innerHTML = slideItems.map((_, i) => `
      <div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToHeroSlide(${i})"></div>
    `).join("");
  }

  // Render Mobile Slides (16:9 ratio)
  if (mobileContainer) {
    mobileContainer.innerHTML = slideItems.map((p, i) => {
      const imgSrc = p.image || "assets/images/hero_banner.jpg";
      return `
        <div class="hero-mobile-slide ${i === 0 ? 'active' : ''}" onclick="openProjectModal('${p.id}')">
          <img src="${imgSrc}" alt="${p.title}" onerror="this.src='assets/images/hero_banner.jpg'">
          <div class="hero-slide-overlay">
            <div>
              <div class="hero-slide-category">${p.subCategoryName || p.categoryName || 'Featured Work'}</div>
              <div class="hero-slide-title">${p.title}</div>
            </div>
            <span class="hero-slide-badge-btn">👁️ View</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // Render Mobile Dots
  if (mobileDots) {
    mobileDots.innerHTML = slideItems.map((_, i) => `
      <div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToHeroSlide(${i})"></div>
    `).join("");
  }

  function restartHeroTimer() {
    if (heroSliderTimer) clearInterval(heroSliderTimer);
    heroSliderTimer = setInterval(nextHeroSlide, 4500);
  }

  function nextHeroSlide() {
    currentSlide = (currentSlide + 1) % slideItems.length;
    updateHeroSlideVisuals(currentSlide, slideItems.length);
  }

  function prevHeroSlide() {
    currentSlide = (currentSlide - 1 + slideItems.length) % slideItems.length;
    updateHeroSlideVisuals(currentSlide, slideItems.length);
  }

  window.goToHeroSlide = function(index) {
    currentSlide = index;
    updateHeroSlideVisuals(currentSlide, slideItems.length);
    restartHeroTimer();
  };

  function updateHeroSlideVisuals(index, total) {
    // Desktop
    const dSlides = document.querySelectorAll(".hero-desktop-slide");
    const dDots = document.querySelectorAll("#hero-desktop-nav-dots .slider-dot");
    dSlides.forEach((s, i) => {
      if (i === index) s.classList.add("active");
      else s.classList.remove("active");
    });
    dDots.forEach((d, i) => {
      if (i === index) d.classList.add("active");
      else d.classList.remove("active");
    });

    // Mobile
    const mSlides = document.querySelectorAll(".hero-mobile-slide");
    const mDots = document.querySelectorAll("#hero-mobile-nav-dots .slider-dot");
    mSlides.forEach((s, i) => {
      if (i === index) s.classList.add("active");
      else s.classList.remove("active");
    });
    mDots.forEach((d, i) => {
      if (i === index) d.classList.add("active");
      else d.classList.remove("active");
    });
  }

  // Touch Swipe & Mouse Drag on Mobile Track
  if (mobileContainer) {
    attachSwipeGesture(mobileContainer, () => {
      nextHeroSlide();
      restartHeroTimer();
    }, () => {
      prevHeroSlide();
      restartHeroTimer();
    });
  }

  // Touch Swipe & Mouse Drag on Desktop Card
  const targetDesktop = desktopCard || desktopContainer;
  if (targetDesktop) {
    attachSwipeGesture(targetDesktop, () => {
      nextHeroSlide();
      restartHeroTimer();
    }, () => {
      prevHeroSlide();
      restartHeroTimer();
    });
  }

  restartHeroTimer();
}

/**
 * Universal Touch & Mouse Drag / Swipe Gesture Helper
 */
function attachSwipeGesture(element, onSwipeLeft, onSwipeRight) {
  if (!element) return;
  let startX = 0;
  let startY = 0;
  let isPointerDown = false;

  // Touch handlers
  element.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  element.addEventListener("touchend", (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        if (typeof onSwipeLeft === "function") onSwipeLeft();
      } else {
        if (typeof onSwipeRight === "function") onSwipeRight();
      }
    }
  }, { passive: true });

  // Mouse drag handlers
  element.addEventListener("mousedown", (e) => {
    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  element.addEventListener("mouseup", (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        if (typeof onSwipeLeft === "function") onSwipeLeft();
      } else {
        if (typeof onSwipeRight === "function") onSwipeRight();
      }
    }
  });

  element.addEventListener("mouseleave", () => {
    isPointerDown = false;
  });
}

/* ==========================================================================
   9. SKILLS, TESTIMONIALS & SOCIAL LINKS
   ========================================================================== */
function renderSkills(skills) {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = skills.map(sk => `
    <div class="skill-card">
      <div class="skill-header">
        <span class="skill-name">${sk.name}</span>
        <span class="skill-percent">${sk.level}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-progress" style="width: ${sk.level}%;"></div>
      </div>
    </div>
  `).join("");
}

let testimonialSliderTimer = null;
let currentTestimonialSlide = 0;

function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonials-container");
  if (!container) return;

  if (!testimonials || testimonials.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-dim); padding: 2rem 0;">No client reviews available yet.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="testimonials-slider-box" id="testimonials-slider-box">
      <div class="testimonials-track" id="testimonials-track">
        ${testimonials.map((t, idx) => `
          <div class="testimonial-card ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <div>
              <div class="stars-row">${"★".repeat(t.rating || 5)}</div>
              <p class="testimonial-text">"${t.comment || t.text}"</p>
            </div>
            <div class="testimonial-author">
              <img src="${t.avatar || 'assets/images/avatar.svg'}" alt="${t.name}" class="author-avatar" onerror="this.src='assets/images/avatar.svg'">
              <div class="author-info">
                <h4>${t.name}</h4>
                <p>${t.role || 'Client'}</p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="testimonials-dots-row" id="testimonials-dots-row">
        ${testimonials.map((_, idx) => `
          <div class="slider-dot ${idx === 0 ? 'active' : ''}" onclick="goToTestimonialSlide(${idx})"></div>
        `).join("")}
      </div>
    </div>
  `;

  const totalSlides = testimonials.length;
  currentTestimonialSlide = 0;

  function updateTestimonialVisuals(idx) {
    currentTestimonialSlide = idx;
    const cards = document.querySelectorAll("#testimonials-track .testimonial-card");
    const dots = document.querySelectorAll("#testimonials-dots-row .slider-dot");
    cards.forEach((c, i) => {
      if (i === currentTestimonialSlide) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
    dots.forEach((d, i) => {
      if (i === currentTestimonialSlide) d.classList.add("active");
      else d.classList.remove("active");
    });
  }

  window.goToTestimonialSlide = function(idx) {
    updateTestimonialVisuals(idx);
    restartTestimonialTimer();
  };

  function nextTestimonial() {
    currentTestimonialSlide = (currentTestimonialSlide + 1) % totalSlides;
    updateTestimonialVisuals(currentTestimonialSlide);
  }

  function prevTestimonial() {
    currentTestimonialSlide = (currentTestimonialSlide - 1 + totalSlides) % totalSlides;
    updateTestimonialVisuals(currentTestimonialSlide);
  }

  function restartTestimonialTimer() {
    if (testimonialSliderTimer) clearInterval(testimonialSliderTimer);
    if (totalSlides > 1) {
      testimonialSliderTimer = setInterval(nextTestimonial, 4500);
    }
  }

  const sliderBox = document.getElementById("testimonials-slider-box");
  if (sliderBox && totalSlides > 1) {
    attachSwipeGesture(sliderBox, () => {
      nextTestimonial();
      restartTestimonialTimer();
    }, () => {
      prevTestimonial();
      restartTestimonialTimer();
    });
    restartTestimonialTimer();
  }
}

function renderSocialLinks(socials, customSocials) {
  const container = document.getElementById("footer-socials-container") || document.getElementById("footer-social-links");
  if (!container) return;

  const socialIcons = {
    whatsapp: "💬",
    behance: "🎨",
    dribbble: "🏀",
    instagram: "📸",
    linkedin: "💼",
    youtube: "▶️",
    github: "💻",
    facebook: "👥"
  };

  let standardHtml = Object.entries(socials || {})
    .filter(([_, url]) => url && url.trim().length > 0)
    .map(([platform, url]) => `
      <a href="${url}" target="_blank" rel="noopener" class="social-icon-btn" title="${platform}">
        ${socialIcons[platform] || "🔗"}
      </a>
    `).join("");

  let customHtml = (customSocials || [])
    .filter(cs => cs.url && cs.url.trim().length > 0)
    .map(cs => `
      <a href="${cs.url}" target="_blank" rel="noopener" class="social-icon-btn" title="${cs.name}">
        ${cs.icon || "🔗"}
      </a>
    `).join("");

  container.innerHTML = standardHtml + customHtml;
}

/* ==========================================================================
   10. LIGHTBOX MODAL WITH RATINGS, REVIEWS & DUAL VIDEO SUPPORT
   ========================================================================== */
let activeModalProject = null;
let currentLightboxImageIndex = 0;
let currentSelectedRating = 5;

window.openProjectModal = function(projectId) {
  const project = window.PortfolioData ? window.PortfolioData.getProjectById(projectId) : null;
  if (!project) return;

  activeModalProject = project;
  currentLightboxImageIndex = 0;
  const modal = document.getElementById("project-modal");
  const mediaContainer = document.getElementById("modal-media-container");
  const galleryThumbs = document.getElementById("modal-gallery-thumbs");

  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [project.image || "assets/images/project_placeholder.svg"];

  // Video or Image rendering
  if (project.videoFile && project.videoFile.trim().length > 0) {
    mediaContainer.innerHTML = `
      <video src="${project.videoFile}" controls autoplay style="width:100%; height:100%; object-fit:contain; background:#000;"></video>
    `;
    galleryThumbs.style.display = "none";
  } else if (project.videoUrl && project.videoUrl.trim().length > 0) {
    let embedUrl = project.videoUrl;
    if (embedUrl.includes("watch?v=")) {
      embedUrl = embedUrl.replace("watch?v=", "embed/");
    } else if (embedUrl.includes("youtu.be/")) {
      embedUrl = embedUrl.replace("youtu.be/", "www.youtube.com/embed/");
    }
    mediaContainer.innerHTML = `
      <iframe src="${embedUrl}" title="${project.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    galleryThumbs.style.display = "none";
  } else {
    updateLightboxMedia(images[0]);
    
    // Render Gallery Thumbnails if > 1 image
    if (images.length > 1) {
      galleryThumbs.style.display = "flex";
      galleryThumbs.innerHTML = images.map((imgUrl, i) => `
        <div class="gallery-thumb-item ${i === 0 ? 'active' : ''}" onclick="switchLightboxImage(${i})">
          <img src="${imgUrl}" alt="Gallery ${i}">
        </div>
      `).join("");
    } else {
      galleryThumbs.style.display = "none";
    }
  }

  setText("modal-category-tag", project.subCategoryName || project.categoryName || "Work");
  setText("modal-title", project.title);
  setText("modal-description", project.description);
  setText("modal-client", project.client || "Confidential Client");
  setText("modal-duration", project.duration || "1 Week");

  const toolsContainer = document.getElementById("modal-tools-container");
  if (toolsContainer) {
    toolsContainer.innerHTML = (project.tools || []).map(t => `<span class="project-tag-pill" style="color:#fff; background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.4);">${t}</span>`).join("");
  }

  // Render Reviews & Rating Section
  renderProjectReviewsSection(project);

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.switchLightboxImage = function(index) {
  if (!activeModalProject) return;
  const images = activeModalProject.images || [activeModalProject.image];
  if (images[index]) {
    currentLightboxImageIndex = index;
    updateLightboxMedia(images[index]);

    const thumbs = document.querySelectorAll(".gallery-thumb-item");
    thumbs.forEach((th, i) => {
      if (i === index) th.classList.add("active");
      else th.classList.remove("active");
    });
  }
};

function updateLightboxMedia(imgSrc) {
  const mediaContainer = document.getElementById("modal-media-container");
  if (mediaContainer) {
    mediaContainer.innerHTML = `<img src="${imgSrc}" alt="${activeModalProject ? activeModalProject.title : 'Project'}">`;
  }
}

function renderProjectReviewsSection(project) {
  const container = document.getElementById("modal-reviews-section");
  if (!container) return;

  const reviews = project.reviews || [];
  const revCount = reviews.length;
  const avgRating = revCount > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / revCount).toFixed(1)
    : "5.0";

  container.innerHTML = `
    <div class="reviews-header">
      <div class="reviews-title">
        <span>⭐ Client &amp; Community Feedback</span>
        <span style="font-size: 0.85rem; color: #fbbf24; font-weight: 700; background: rgba(245,158,11,0.15); padding: 0.2rem 0.6rem; border-radius: 9999px;">★ ${avgRating} / 5.0 (${revCount} reviews)</span>
      </div>
    </div>

    <!-- Review Form -->
    <div class="review-form-card">
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.6rem;">Leave a Rating &amp; Comment</h4>
      <form onsubmit="handleProjectReviewSubmit(event, '${project.id}')">
        
        <div style="margin-bottom: 0.6rem;">
          <div style="font-size: 0.78rem; color: var(--text-dim); margin-bottom: 0.3rem;">Select Star Rating:</div>
          <div class="star-rating-selector" id="star-picker">
            <button type="button" class="star-btn active" data-val="1" onclick="setRatingValue(1)">★</button>
            <button type="button" class="star-btn active" data-val="2" onclick="setRatingValue(2)">★</button>
            <button type="button" class="star-btn active" data-val="3" onclick="setRatingValue(3)">★</button>
            <button type="button" class="star-btn active" data-val="4" onclick="setRatingValue(4)">★</button>
            <button type="button" class="star-btn active" data-val="5" onclick="setRatingValue(5)">★</button>
          </div>
        </div>

        <div style="display: flex; gap: 0.8rem; margin-bottom: 0.6rem; flex-wrap: wrap;">
          <input type="text" id="review-input-name" class="form-control" placeholder="Your Name / Client Brand" required style="flex-grow: 1; min-width: 180px; padding: 0.6rem 0.8rem; font-size: 0.85rem;">
        </div>

        <div style="margin-bottom: 0.8rem;">
          <textarea id="review-input-comment" class="form-control" rows="2" placeholder="Write your feedback, project thoughts, or compliment..." required style="padding: 0.6rem 0.8rem; font-size: 0.85rem;"></textarea>
        </div>

        <button type="submit" class="btn-primary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
          <span>⭐ Submit Review</span>
        </button>
      </form>
    </div>

    <!-- Reviews Feed List -->
    <div class="reviews-feed-list" id="project-reviews-feed">
      ${reviews.length === 0 ? `
        <p style="font-size: 0.85rem; color: var(--text-dim); text-align: center; padding: 1rem;">No reviews yet. Be the first to leave feedback!</p>
      ` : reviews.map(r => `
        <div class="review-item-card">
          <div class="review-item-header">
            <span class="review-user-name">${r.userName}</span>
            <span class="review-stars">${"★".repeat(r.rating || 5)}</span>
          </div>
          <p class="review-text">${r.comment}</p>
          <div class="review-date">${r.date || 'Recent'}</div>
        </div>
      `).join("")}
    </div>
  `;
}

window.setRatingValue = function(val) {
  currentSelectedRating = val;
  const stars = document.querySelectorAll("#star-picker .star-btn");
  stars.forEach((btn, i) => {
    if (i < val) btn.classList.add("active");
    else btn.classList.remove("active");
  });
};

window.handleProjectReviewSubmit = function(event, projectId) {
  event.preventDefault();
  const userName = document.getElementById("review-input-name").value.trim();
  const comment = document.getElementById("review-input-comment").value.trim();

  if (userName && comment) {
    const newRev = window.PortfolioData.addProjectReview(projectId, {
      userName,
      rating: currentSelectedRating,
      comment
    });

    if (newRev) {
      const updatedProject = window.PortfolioData.getProjectById(projectId);
      renderProjectReviewsSection(updatedProject);
      renderProjects(window.PortfolioData.getProjects());
      alert("🎉 Thank you! Your review has been published.");
    }
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    const mediaContainer = document.getElementById("modal-media-container");
    if (mediaContainer) mediaContainer.innerHTML = "";
  }
};

window.closeModalOnBackdrop = function(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
};

/* ==========================================================================
   11. WHATSAPP & NAVIGATION HELPERS
   ========================================================================== */
window.openWhatsAppModal = function() {
  const modal = document.getElementById("whatsapp-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

window.triggerDirectWhatsApp = function() {
  const profile = (window.PortfolioData.get && window.PortfolioData.get().profile) || {};
  const phone = profile.whatsapp || "8250550060";
  const msg = encodeURIComponent("👋 Hello Rammohan! I am visiting your portfolio website and would like to connect regarding a project.");
  window.open(`https://wa.me/91${phone}?text=${msg}`, "_blank");
};

window.triggerDirectCall = function() {
  const profile = (window.PortfolioData.get && window.PortfolioData.get().profile) || {};
  const phone = profile.phone || "8250550062";
  window.location.href = `tel:+91${phone.replace(/[^0-9]/g, '')}`;
};

window.triggerDirectEmail = function() {
  const profile = (window.PortfolioData.get && window.PortfolioData.get().profile) || {};
  const email = profile.email || "rammohanmurmu0@gmail.com";
  window.location.href = `mailto:${email}?subject=Project Inquiry - Rammohan Murmu Creative Services`;
};

window.orderProjectWhatsApp = function() {
  if (!activeModalProject) return;
  const profile = (window.PortfolioData.get && window.PortfolioData.get().profile) || {};
  const phone = profile.whatsapp || "8250550060";

  // Build full reference image URL
  let fullImageUrl = activeModalProject.image || (activeModalProject.images && activeModalProject.images.length > 0 ? activeModalProject.images[0] : "");
  if (fullImageUrl && !fullImageUrl.startsWith("http") && !fullImageUrl.startsWith("data:")) {
    const origin = window.location.origin;
    const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    fullImageUrl = `${origin}${path}${fullImageUrl}`;
  }

  const categoryText = activeModalProject.subCategoryName || activeModalProject.categoryName || activeModalProject.category || "Creative Work";
  const clientText = activeModalProject.client || "Client Showcase";
  const durationText = activeModalProject.duration || "Standard Timeline";
  const toolsText = (activeModalProject.tools || []).join(", ");

  const textMessage = 
    `*🔥 NEW PROJECT INQUIRY / ORDER REQUEST*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👋 Hello *Rammohan Murmu*! I saw this specific project on your portfolio and I would like to order a similar custom work:\n\n` +
    `📌 *Project Name:* ${activeModalProject.title}\n` +
    `🎨 *Category:* ${categoryText}\n` +
    `🏢 *Client / Type:* ${clientText}\n` +
    `⏱️ *Est. Duration:* ${durationText}\n` +
    (toolsText ? `🛠️ *Software/Tools:* ${toolsText}\n` : ``) +
    (fullImageUrl && !fullImageUrl.startsWith("data:") ? `🖼️ *Reference Image URL:*\n${fullImageUrl}\n` : ``) +
    `\n━━━━━━━━━━━━━━━━━━━━\n` +
    `💬 *My Inquiry:* Please share the pricing quote, turnaround time, and your availability for this type of work! 🚀`;

  const encoded = encodeURIComponent(textMessage);
  window.open(`https://wa.me/91${phone}?text=${encoded}`, "_blank");
};

window.sendWhatsAppDirect = function(event) {
  event.preventDefault();
  const name = document.getElementById("wa-name").value.trim();
  const service = document.getElementById("wa-service").value;
  const budget = document.getElementById("wa-budget").value.trim();
  const details = document.getElementById("wa-details").value.trim();
  const profile = window.PortfolioData.get().profile;
  const phone = profile.whatsapp || "8250550060";

  const msg = encodeURIComponent(
    `*🚀 New Project Inquiry from Portfolio Website*\n\n` +
    `*👤 Client Name:* ${name}\n` +
    `*⚡ Service Required:* ${service}\n` +
    `*💰 Budget / Timeline:* ${budget || 'Flexible'}\n` +
    `*📝 Project Brief:* ${details}\n\n` +
    `_Sent via Rammohan Murmu Portfolio Direct Dispatch_`
  );

  window.open(`https://wa.me/91${phone}?text=${msg}`, "_blank");
  closeModal("whatsapp-modal");
};

window.handleContactSubmit = function(event) {
  event.preventDefault();
  const name = document.getElementById("form-name").value.trim();
  const email = document.getElementById("form-email").value.trim();
  const service = document.getElementById("form-service").value;
  const message = document.getElementById("form-message").value.trim();
  const profile = window.PortfolioData.get().profile;
  const phone = profile.whatsapp || "8250550060";

  const msg = encodeURIComponent(
    `*✉️ Contact Form Submission*\n\n` +
    `*Name:* ${name}\n` +
    `*Contact Info:* ${email}\n` +
    `*Service:* ${service}\n` +
    `*Message:* ${message}`
  );

  window.open(`https://wa.me/91${phone}?text=${msg}`, "_blank");
  alert("🚀 Message ready! Opening WhatsApp to send directly.");
  event.target.reset();
};

window.toggleMobileMenu = function() {
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const toggle = document.getElementById("mobile-menu-toggle");
  if (drawer && backdrop && toggle) {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      drawer.classList.add("open");
      backdrop.classList.add("active");
      toggle.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
};

window.closeMobileMenu = function() {
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const toggle = document.getElementById("mobile-menu-toggle");
  if (drawer && backdrop && toggle) {
    drawer.classList.remove("open");
    backdrop.classList.remove("active");
    toggle.classList.remove("active");
    document.body.style.overflow = "auto";
  }
};

function initScrollHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

function initMobileDockObserver() {
  const dockItems = document.querySelectorAll(".mobile-bottom-dock .dock-item");
  const sections = document.querySelectorAll("section[id]");
  if (dockItems.length === 0 || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        dockItems.forEach(item => {
          if (item.getAttribute("data-section") === id) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
}
