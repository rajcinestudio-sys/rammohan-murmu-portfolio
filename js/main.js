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
function applyActiveTheme(themeId) {
  const theme = themeId || (window.PortfolioData && window.PortfolioData.getActiveTheme ? window.PortfolioData.getActiveTheme() : "cyber-dark");
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
}

function updateSectionVisibility(sectionId, hasData, navHref) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = hasData ? "" : "none";
  }
  if (navHref) {
    const links = document.querySelectorAll(`a[href="${navHref}"]`);
    links.forEach(link => {
      const parentLi = link.closest("li");
      const dockBtn = link.classList.contains("dock-item") ? link : null;
      if (parentLi) {
        parentLi.style.display = hasData ? "" : "none";
      } else if (dockBtn) {
        dockBtn.style.display = hasData ? "" : "none";
      } else {
        link.style.display = hasData ? "" : "none";
      }
    });
  }
}

function renderAllPortfolioContent() {
  if (!window.PortfolioData) return;
  const data = window.PortfolioData.get();

  // Apply Theme
  applyActiveTheme(data.activeTheme);

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

  // 2. Services (Auto-hide if empty)
  const servicesList = data.services || [];
  updateSectionVisibility("services", servicesList.length > 0, "#services");
  if (servicesList.length > 0) {
    renderServices(servicesList);
  }

  // 3. Portfolio Categories, Subfilters & Projects (Auto-hide if empty)
  const projectsList = data.projects || [];
  updateSectionVisibility("portfolio", projectsList.length > 0, "#portfolio");
  if (projectsList.length > 0) {
    initPortfolioFilters(projectsList);
  }

  // 4. Hero Works 3D Slider
  initHeroWorksSlider(projectsList);

  // 5. Skills (Auto-hide if empty)
  const skillsList = data.skills || [];
  updateSectionVisibility("skills", skillsList.length > 0, "#skills");
  if (skillsList.length > 0) {
    renderSkills(skillsList);
  }

  // 6. Testimonials & Client Reviews (Auto-hide if empty)
  const projectReviews = (data.projects || []).flatMap(p => 
    (p.reviews || []).map(r => ({
      id: r.id,
      name: r.userName || r.name || "Client",
      role: r.projectTitle ? `Client (${r.projectTitle})` : (r.role || "Verified Client"),
      comment: r.comment || r.text || "",
      rating: r.rating || 5,
      avatar: r.avatar || "assets/images/avatar.svg"
    }))
  );
  const directTestimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
  const allReviews = [
    ...directTestimonials,
    ...projectReviews
  ].filter(t => (t.comment && t.comment.trim().length > 0) || (t.text && t.text.trim().length > 0));

  const hasReviews = allReviews.length > 0;
  updateSectionVisibility("testimonials", hasReviews, "#testimonials");
  if (hasReviews) {
    renderTestimonials(allReviews);
  }
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
  const section = document.getElementById("testimonials");
  if (!container) return;

  if (!testimonials || testimonials.length === 0) {
    if (section) section.style.display = "none";
    updateSectionVisibility("testimonials", false, "#testimonials");
    return;
  }

  if (section) section.style.display = "";
  updateSectionVisibility("testimonials", true, "#testimonials");

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

const BRAND_SVG_ICONS = {
  youtube: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.301-.15-1.782-.878-2.058-.978-.276-.1-.476-.15-.677.15-.2.3-.776.979-.952 1.18-.175.2-.351.224-.652.075s-1.272-.469-2.423-1.496c-.896-.799-1.5-1.786-1.676-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526s-.677-1.632-.927-2.235c-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.801.376s-1.053 1.028-1.053 2.508 1.078 2.908 1.228 3.109c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.377.197 1.895.12.578-.087 1.782-.728 2.032-1.432.251-.705.251-1.309.175-1.432-.075-.123-.275-.198-.576-.349zm-5.467 7.426h-.002c-1.808 0-3.582-.486-5.132-1.408l-.368-.218-3.816 1 1.018-3.72-.239-.38a10.22 10.22 0 0 1-1.57-5.485c0-5.676 4.618-10.294 10.297-10.294 2.75 0 5.334 1.072 7.28 3.019a10.237 10.237 0 0 1 3.015 7.277c0 5.678-4.619 10.295-10.299 10.295zM20.52 3.48A12.08 12.08 0 0 0 12.005 0C5.38 0 .001 5.378 0 12.003c0 2.115.553 4.181 1.604 6.002L0 24l6.165-1.617a12.023 12.023 0 0 0 5.84 1.503h.005c6.624 0 12.004-5.379 12.005-12.005 0-3.208-1.25-6.224-3.495-8.401z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.254 0-5.836-3.047-5.836-6.195 0-3.791 2.203-6.195 5.799-6.195 3.738 0 5.488 2.658 5.488 5.748 0 .545-.047 1.242-.074 1.642h-8.318c.038 2.052 1.341 3.5 3.328 3.5 1.488 0 2.42-.693 2.766-1.5h1.948zm-7.973-4.5h5.451c-.088-1.531-1.07-2.617-2.678-2.617-1.637 0-2.646 1.055-2.773 2.617zm-10.753-4.5h-5v12h5.589c3.082 0 4.411-1.672 4.411-3.699 0-1.289-.641-2.45-2.062-2.91 1.139-.461 1.676-1.469 1.676-2.602 0-1.926-1.391-2.789-3.614-2.789zm-2.5 4.5h2.5c.961 0 1.5.539 1.5 1.25 0 .73-.559 1.25-1.5 1.25h-2.5v-2.5zm0-2.5v-2h2c.867 0 1.5.422 1.5 1 0 .6-.633 1-1.5 1h-2z"/></svg>`,
  dribbble: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.193 11.254c-.217-.035-2.624-.417-5.234.338-.284-.648-.593-1.319-.927-2.001 3.42-1.458 4.793-3.418 4.887-3.555 1.503 1.487 2.441 3.541 2.441 5.808 0 .285-.018.567-.052.845-.36-.454-.787-.962-1.115-1.435zm-2.093-6.657c-.11.157-1.442 1.996-4.717 3.39-1.272-2.348-2.671-4.415-2.827-4.646 1.954-.836 4.125-.79 6.044.256 1.096.6 2.046 1.455 2.766 2.482-.416-.549-.838-1.026-1.266-1.482zm-8.877-3.957c.162.237 1.538 2.274 2.809 4.593-3.664 1.082-7.234 1.091-7.592 1.091 1.066-2.518 3.125-4.484 5.783-5.684zm-6.195 7.159c.35 0 3.565-.008 7.039-.993.303.626.586 1.24.847 1.838-4.57 1.397-8.85 5.568-9.025 5.74-.984-1.637-1.554-3.547-1.554-5.592 0-.339.018-.674.053-1.003.88.006 1.764.01 2.64.01zm3.176 13.064c.164-.162 3.993-3.882 8.441-5.183 1.155 3.013 1.632 5.579 1.724 6.115-1.642 1.002-3.57 1.583-5.641 1.583-1.62 0-3.151-.357-4.524-.997zm11.399-.187c-.114-.587-.588-2.987-1.691-5.879 2.425-.747 4.599-.408 4.797-.375-.246 2.39-1.39 4.529-3.106 6.254z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.196 1.006.128.832.942z"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
  generic: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

function getSocialIconMeta(platformKey, url, customIcon) {
  const normKey = (platformKey || "").toLowerCase().trim();
  const normUrl = (url || "").toLowerCase().trim();

  if (normKey.includes("youtube") || normUrl.includes("youtube.com") || normUrl.includes("youtu.be")) return { svg: BRAND_SVG_ICONS.youtube, brand: "youtube", label: "YouTube" };
  if (normKey.includes("facebook") || normUrl.includes("facebook.com") || normUrl.includes("fb.com")) return { svg: BRAND_SVG_ICONS.facebook, brand: "facebook", label: "Facebook" };
  if (normKey.includes("instagram") || normUrl.includes("instagram.com") || normUrl.includes("instagr.am")) return { svg: BRAND_SVG_ICONS.instagram, brand: "instagram", label: "Instagram" };
  if (normKey.includes("whatsapp") || normUrl.includes("wa.me") || normUrl.includes("whatsapp.com")) return { svg: BRAND_SVG_ICONS.whatsapp, brand: "whatsapp", label: "WhatsApp" };
  if (normKey.includes("linkedin") || normUrl.includes("linkedin.com")) return { svg: BRAND_SVG_ICONS.linkedin, brand: "linkedin", label: "LinkedIn" };
  if (normKey === "x" || normKey.includes("twitter") || normUrl.includes("twitter.com") || normUrl.includes("x.com")) return { svg: BRAND_SVG_ICONS.twitter, brand: "twitter", label: "Twitter / X" };
  if (normKey.includes("behance") || normUrl.includes("behance.net")) return { svg: BRAND_SVG_ICONS.behance, brand: "behance", label: "Behance" };
  if (normKey.includes("dribbble") || normUrl.includes("dribbble.com")) return { svg: BRAND_SVG_ICONS.dribbble, brand: "dribbble", label: "Dribbble" };
  if (normKey.includes("github") || normUrl.includes("github.com")) return { svg: BRAND_SVG_ICONS.github, brand: "github", label: "GitHub" };
  if (normKey.includes("telegram") || normUrl.includes("t.me") || normUrl.includes("telegram.me")) return { svg: BRAND_SVG_ICONS.telegram, brand: "telegram", label: "Telegram" };
  if (normKey.includes("pinterest") || normUrl.includes("pinterest.com")) return { svg: BRAND_SVG_ICONS.pinterest, brand: "pinterest", label: "Pinterest" };
  if (normKey.includes("discord") || normUrl.includes("discord.gg") || normUrl.includes("discord.com")) return { svg: BRAND_SVG_ICONS.discord, brand: "discord", label: "Discord" };

  if (BRAND_SVG_ICONS[normKey]) {
    return { svg: BRAND_SVG_ICONS[normKey], brand: normKey, label: platformKey };
  }

  if (customIcon && customIcon !== "🔗") {
    return { svg: `<span class="custom-social-glyph">${customIcon}</span>`, brand: "custom", label: platformKey || "Social Link" };
  }

  return { svg: BRAND_SVG_ICONS.generic, brand: "generic", label: platformKey || "Website" };
}

function renderSocialLinks(socials, customSocials) {
  const container = document.getElementById("footer-socials-container") || document.getElementById("footer-social-links");
  if (!container) return;

  const validItems = [];

  // Process standard socials - ONLY if user provided a valid non-empty URL
  if (socials && typeof socials === "object") {
    Object.entries(socials).forEach(([platform, url]) => {
      if (typeof url === "string" && url.trim().length > 0 && url.trim() !== "#") {
        const meta = getSocialIconMeta(platform, url);
        validItems.push({
          url: url.trim(),
          svg: meta.svg,
          brand: meta.brand,
          title: meta.label || platform
        });
      }
    });
  }

  // Process custom socials - ONLY if URL is valid and non-empty
  if (Array.isArray(customSocials)) {
    customSocials.forEach(cs => {
      if (cs && typeof cs.url === "string" && cs.url.trim().length > 0 && cs.url.trim() !== "#") {
        const meta = getSocialIconMeta(cs.name || "", cs.url, cs.icon);
        validItems.push({
          url: cs.url.trim(),
          svg: meta.svg,
          brand: meta.brand,
          title: cs.name || meta.label || "Social Link"
        });
      }
    });
  }

  if (validItems.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = validItems.map(item => `
    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="social-icon-btn brand-${item.brand}" title="${item.title}" aria-label="${item.title}">
      ${item.svg}
    </a>
  `).join("");
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
