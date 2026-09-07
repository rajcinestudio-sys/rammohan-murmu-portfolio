/**
 * Admin Dashboard & CMS Controller (v3.0)
 * Rammohan Murmu Portfolio
 */

const SESSION_AUTH_KEY = "rammohan_admin_auth_v3";

let currentProjectImages = [];
let currentThumbnailImage = "";
let currentProjectVideoFile = "";

const SUBCATEGORY_OPTIONS = {
  graphics: [
    { id: "thumbnail", name: "📺 YouTube Thumbnails" },
    { id: "poster", name: "🖼️ Posters & Flyers" },
    { id: "logo", name: "✨ Logos & Branding" },
    { id: "flex_banner", name: "📐 Flex & Hoardings" },
    { id: "certificate_id", name: "🎖️ Certificates & ID Cards" },
    { id: "social_media", name: "📱 Social Media Creatives" },
    { id: "vector_art", name: "✏️ Vector Art & Illustrations" },
    { id: "custom", name: "➕ Custom Subcategory..." }
  ],
  video: [
    { id: "cinematic", name: "🎥 Cinematic Edits" },
    { id: "yt_retention", name: "⚡ YouTube Retention Edits" },
    { id: "teaser_trailer", name: "🎞️ Teasers & Trailers" },
    { id: "promo_commercial", name: "📢 Promo & Commercials" },
    { id: "reels_shorts", name: "📱 Reels & Shorts" },
    { id: "vfx_intro", name: "✨ VFX & Intros" },
    { id: "custom", name: "➕ Custom Subcategory..." }
  ],
  uiux: [
    { id: "mobile_app", name: "📱 Mobile App UI (Figma)" },
    { id: "web_design", name: "🌐 Modern Web & Landing" },
    { id: "saas_dashboard", name: "📊 SaaS Dashboards" },
    { id: "wireframe", name: "📐 Wireframing & UX Flow" },
    { id: "custom", name: "➕ Custom Subcategory..." }
  ]
};

// Image compression helper to prevent localStorage 5MB quota overflow
function compressImageFile(file, maxWidth = 1000, maxHeight = 1000, quality = 0.82, callback) {
  if (!file) return;
  if (file.type === "image/svg+xml") {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      callback(compressedDataUrl);
    };
    img.onerror = function() {
      callback(e.target.result);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth();
  initTabNavigation();
  checkSupabaseStatus();
  // Deferred storage widget refresh: wait for Supabase SDK to be ready
  setTimeout(() => refreshStorageWidget(), 1800);
});

/* ==========================================================================
   1. AUTHENTICATION & SUPABASE AUTH / PIN MANAGEMENT
   ========================================================================== */

/**
 * Switch between Email Login, Forgot Password, and PIN Views
 */
window.switchAuthView = function(viewName) {
  const viewLogin = document.getElementById("auth-view-login");
  const viewForgot = document.getElementById("auth-view-forgot");
  const viewPin = document.getElementById("auth-view-pin");
  const icon = document.getElementById("auth-card-icon");

  if (viewLogin) viewLogin.style.display = viewName === "login" ? "block" : "none";
  if (viewForgot) viewForgot.style.display = viewName === "forgot" ? "block" : "none";
  if (viewPin) viewPin.style.display = viewName === "pin" ? "block" : "none";

  if (icon) {
    if (viewName === "login") icon.textContent = "⚡";
    else if (viewName === "forgot") icon.textContent = "🔑";
    else if (viewName === "pin") icon.textContent = "🔒";
  }
};

/**
 * Check authentication status (Supabase session or PIN session)
 */
async function checkAuth() {
  const lockscreen = document.getElementById("pin-lockscreen");
  const sidebar = document.getElementById("admin-sidebar");
  const main = document.getElementById("admin-main");
  const resetModal = document.getElementById("reset-password-modal");

  // Check if arriving via Supabase Password Recovery link in URL hash
  const hash = window.location.hash || "";
  if (hash.includes("type=recovery") || hash.includes("access_token=")) {
    if (resetModal) resetModal.style.display = "flex";
    return;
  }

  let isAuth = sessionStorage.getItem(SESSION_AUTH_KEY) === "true";
  let userEmail = "Admin";

  // Check Supabase Auth session if configured
  if (typeof window.supabaseGetCurrentUser === "function") {
    try {
      const user = await window.supabaseGetCurrentUser();
      if (user && user.email) {
        isAuth = true;
        userEmail = user.email;
        sessionStorage.setItem(SESSION_AUTH_KEY, "true");
      }
    } catch (e) {
      console.warn("[Admin Auth] Session check error:", e);
    }
  }

  // Update user email badge
  const userPill = document.getElementById("sidebar-user-email");
  const syncEmail = document.getElementById("admin-logged-in-email");
  if (userPill) userPill.textContent = userEmail;
  if (syncEmail) syncEmail.textContent = userEmail;

  if (isAuth) {
    if (lockscreen) lockscreen.style.display = "none";
    if (sidebar && window.innerWidth > 860) sidebar.style.display = "flex";
    if (main) main.style.display = "block";
    loadDashboardData();
  } else {
    if (lockscreen) lockscreen.style.display = "flex";
    if (sidebar) sidebar.style.display = "none";
    if (main) main.style.display = "none";
  }
}

/**
 * Handle Supabase Email & Password Sign In
 */
window.handleSupabaseLogin = async function(e) {
  e.preventDefault();
  const emailInput = document.getElementById("admin-login-email");
  const passInput = document.getElementById("admin-login-password");
  const submitBtn = document.getElementById("btn-login-submit");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passInput ? passInput.value : "";

  if (!email || !password) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳ Verifying credentials...</span>`;
  }

  // Check if Supabase client is ready
  if (typeof window.supabaseSignIn === "function") {
    const res = await window.supabaseSignIn(email, password);
    if (res.success) {
      sessionStorage.setItem(SESSION_AUTH_KEY, "true");
      showToast(`🎉 Welcome back, ${res.user?.email || 'Admin'}!`);
      if (passInput) passInput.value = "";
      await checkAuth();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>🔓 Sign In to CMS</span>`;
      }
      return;
    } else {
      alert("❌ Supabase Sign In Failed:\n" + res.error + "\n\nTip: You can also use the 'Quick PIN Access' option below.");
    }
  } else {
    alert("Supabase is not initialized. Please use Quick PIN Access.");
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>🔓 Sign In to CMS</span>`;
  }
};

/**
 * Handle Forgot Password request (send reset link via Supabase)
 */
window.handleSupabaseForgotPassword = async function(e) {
  e.preventDefault();
  const emailInput = document.getElementById("admin-forgot-email");
  const submitBtn = document.getElementById("btn-forgot-submit");
  const email = emailInput ? emailInput.value.trim() : "";

  if (!email) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>⏳ Sending link...</span>`;
  }

  if (typeof window.supabaseResetPassword === "function") {
    const res = await window.supabaseResetPassword(email);
    if (res.success) {
      alert("📧 " + res.message);
      switchAuthView("login");
    } else {
      alert("❌ Failed to send reset email:\n" + res.error);
    }
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>📧 Send Reset Link</span>`;
  }
};

/**
 * Handle Save New Password after clicking reset link
 */
window.handleSaveNewPassword = async function(e) {
  e.preventDefault();
  const p1 = document.getElementById("new-password-val")?.value;
  const p2 = document.getElementById("confirm-new-password-val")?.value;

  if (!p1 || p1.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }
  if (p1 !== p2) {
    alert("Passwords do not match. Please re-enter.");
    return;
  }

  if (typeof window.supabaseUpdatePassword === "function") {
    const res = await window.supabaseUpdatePassword(p1);
    if (res.success) {
      alert("🎉 Password updated successfully! Logging you into the CMS.");
      const modal = document.getElementById("reset-password-modal");
      if (modal) modal.style.display = "none";
      window.location.hash = "";
      sessionStorage.setItem(SESSION_AUTH_KEY, "true");
      await checkAuth();
    } else {
      alert("❌ Failed to update password: " + res.error);
    }
  }
};

/**
 * Handle PIN Login (Fallback & Quick Access)
 */
window.handlePinLogin = function(e) {
  e.preventDefault();
  const pinInputEl = document.getElementById("admin-pin-input");
  const inputPin = pinInputEl ? pinInputEl.value.trim() : "";
  const data = window.PortfolioData ? window.PortfolioData.get() : DEFAULT_PORTFOLIO_DATA;
  const currentPin = data.adminPin || "1234";

  if (inputPin === currentPin) {
    sessionStorage.setItem(SESSION_AUTH_KEY, "true");
    if (pinInputEl) pinInputEl.value = "";
    showToast("🎉 PIN Verified! Welcome to Admin CMS.");
    checkAuth();
  } else {
    alert("❌ Incorrect PIN. Default PIN is 1234.");
    if (pinInputEl) {
      pinInputEl.value = "";
      pinInputEl.focus();
    }
  }
};

/**
 * Handle Admin Logout
 */
window.handleAdminLogout = async function() {
  if (typeof window.supabaseSignOut === "function") {
    await window.supabaseSignOut();
  }
  sessionStorage.removeItem(SESSION_AUTH_KEY);
  showToast("🔒 Logged out of Admin CMS.");
  await checkAuth();
};


/* ==========================================================================
   2. MOBILE SIDEBAR DRAWER & HAMBURGER
   ========================================================================== */
window.toggleAdminMobileSidebar = function() {
  const sidebar = document.getElementById("admin-sidebar");
  const backdrop = document.getElementById("admin-sidebar-backdrop");
  const hamburger = document.getElementById("admin-hamburger-btn");
  if (sidebar && backdrop) {
    const isOpen = sidebar.classList.contains("mobile-open");
    if (isOpen) {
      sidebar.classList.remove("mobile-open");
      backdrop.classList.remove("active");
      if (hamburger) hamburger.classList.remove("active");
    } else {
      sidebar.classList.add("mobile-open");
      backdrop.classList.add("active");
      if (hamburger) hamburger.classList.add("active");
    }
  }
};

window.closeAdminMobileSidebar = function() {
  const sidebar = document.getElementById("admin-sidebar");
  const backdrop = document.getElementById("admin-sidebar-backdrop");
  const hamburger = document.getElementById("admin-hamburger-btn");
  if (sidebar && sidebar.classList.contains("mobile-open")) {
    sidebar.classList.remove("mobile-open");
    if (backdrop) backdrop.classList.remove("active");
    if (hamburger) hamburger.classList.remove("active");
  }
};

window.switchAdminTab = function(targetTab) {
  const tabBtn = document.querySelector(`.nav-tab-btn[data-tab="${targetTab}"], .admin-dock-btn[data-tab="${targetTab}"]`);
  if (tabBtn) {
    tabBtn.click();
  }
};

window.openCloudSyncTabFromMenu = function() {
  window.switchAdminTab("tab-sync");
  window.closeAdminMobileSidebar();
};

/* ==========================================================================
   3. TAB NAVIGATION (DESKTOP & MOBILE DOCK)
   ========================================================================== */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll(".nav-tab-btn, .admin-dock-btn");
  const panels = document.querySelectorAll(".tab-panel");
  const headingTitle = document.getElementById("tab-heading-title");
  const headingDesc = document.getElementById("tab-heading-desc");

  const tabMeta = {
    "tab-overview": {
      title: "Dashboard Overview",
      desc: "Manage your portfolio projects, subcategories, services, and live updates without touching code."
    },
    "tab-projects": {
      title: "Project & Subcategory Manager",
      desc: "Upload multiple images, posters, thumbnails, video files or YouTube links, and set subcategories."
    },
    "tab-services": {
      title: "Services & Offerings Manager",
      desc: "Customize service titles, badges, tag chips, software tools, proficiency bars, and theme colors."
    },
    "tab-profile": {
      title: "Profile & YouTube Social Hub",
      desc: "Update your name, bio, phone, WhatsApp number, YouTube channel settings, and social media handles."
    },
    "tab-skills": {
      title: "Skills & Mastery Levels",
      desc: "Configure software proficiencies and percentage progress bars with live editing."
    },
    "tab-reviews": {
      title: "Client & Visitor Feedback Moderation",
      desc: "View and moderate ratings and comments left by visitors on your projects."
    },
    "tab-sync": {
      title: "Backup, Sync & Security",
      desc: "Export data.json for GitHub Pages, restore backups, or change your security PIN."
    },
    "tab-themes": {
      title: "3D Theme Studio & Presets",
      desc: "Customize and switch your portfolio visual aesthetics with 1-click 3D theme presets."
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      tabBtns.forEach(b => {
        if (b.getAttribute("data-tab") === targetTab) b.classList.add("active");
        else b.classList.remove("active");
      });

      panels.forEach(p => {
        p.classList.remove("active");
        if (p.id === targetTab) p.classList.add("active");
      });

      if (tabMeta[targetTab]) {
        headingTitle.textContent = tabMeta[targetTab].title;
        headingDesc.textContent = tabMeta[targetTab].desc;
      }

      // Close mobile sidebar if open
      const sidebar = document.getElementById("admin-sidebar");
      const backdrop = document.getElementById("admin-sidebar-backdrop");
      const hamburger = document.getElementById("admin-hamburger-btn");
      if (sidebar && sidebar.classList.contains("mobile-open")) {
        sidebar.classList.remove("mobile-open");
        if (backdrop) backdrop.classList.remove("active");
        if (hamburger) hamburger.classList.remove("active");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ==========================================================================
   4. LOAD DASHBOARD DATA
   ========================================================================== */
function loadDashboardData() {
  const data = window.PortfolioData.get();
  
  // 1. Stats
  const projects = data.projects || [];
  const services = data.services || [];
  const projectReviews = projects.flatMap(p => (p.reviews || []).map(r => ({ ...r, projectTitle: p.title, projectId: p.id })));
  const directTestimonials = (data.testimonials || []).map(t => ({
    id: t.id,
    userName: t.name,
    comment: t.comment || t.text,
    rating: t.rating || 5,
    projectTitle: t.role || 'Featured Client',
    projectId: 'testimonial'
  }));
  const allReviews = [...directTestimonials, ...projectReviews];

  document.getElementById("dash-total-projects").textContent = projects.length;
  document.getElementById("dash-services-count").textContent = services.length;
  document.getElementById("dash-youtube-subs").textContent = (data.socialHub && data.socialHub.subscribersCount) || "15.4K+";
  document.getElementById("dash-reviews-count").textContent = allReviews.length;

  // 2. Tables, Themes & Managers
  renderProjectsTable(projects);
  renderAdminServices(services);
  loadProfileFormData(data.profile, data.socialHub);
  renderAdminSkills(data.skills || []);
  renderAdminReviews(allReviews);
  renderAdminThemeCards(data.activeTheme || "cyber-dark");

  // 3. Refresh storage usage widget
  refreshStorageWidget();
}

/**
 * Refresh the Supabase Storage Usage widget on the dashboard
 */
async function refreshStorageWidget() {
  const el = document.getElementById("dash-storage-widget");
  if (!el) return;

  if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
    el.innerHTML = `
      <div class="stat-widget-icon" style="background: rgba(100,116,139,0.15); color: #64748b;">📦</div>
      <div class="stat-widget-info">
        <h3 style="font-size: 1rem; color: #64748b;">N/A</h3>
        <p>Supabase Storage</p>
        <p style="font-size: 0.72rem; color: #475569; margin-top: 0.15rem;">Configure Supabase first</p>
      </div>`;
    return;
  }

  // Loading state
  el.innerHTML = `
    <div class="stat-widget-icon" style="background: rgba(6,182,212,0.15); color: var(--accent-cyan);">📦</div>
    <div class="stat-widget-info">
      <h3 style="font-size: 1rem;">Loading...</h3>
      <p>Supabase Storage</p>
    </div>`;

  if (typeof window.supabaseGetStorageUsage !== "function") return;
  const usage = await window.supabaseGetStorageUsage();

  if (!usage.success) {
    if (usage.bucketMissing) {
      el.innerHTML = `
        <div class="stat-widget-icon" style="background: rgba(245,158,11,0.15); color: #f59e0b;">⚠️</div>
        <div class="stat-widget-info" style="width: 100%;">
          <h3 style="font-size: 0.95rem; color: #f59e0b;">Bucket 'portfolio-media' Missing</h3>
          <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">Run the SQL schema in Supabase to enable cloud media storage.</p>
          <div style="margin-top: 0.4rem; display: flex; gap: 0.4rem;">
            <button onclick="handleCopySqlSchema()" style="background: rgba(6,182,212,0.15); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); border-radius: 6px; padding: 0.2rem 0.5rem; font-size: 0.72rem; cursor: pointer;">📋 Copy Setup SQL</button>
            <button onclick="refreshStorageWidget()" style="background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 0.72rem;">🔄 Retry</button>
          </div>
        </div>`;
      return;
    }
    el.innerHTML = `
      <div class="stat-widget-icon" style="background: rgba(239,68,68,0.15); color: #ef4444;">📦</div>
      <div class="stat-widget-info">
        <h3 style="font-size: 0.9rem; color: #ef4444;">Storage Offline</h3>
        <p style="font-size: 0.7rem; color: #ef4444; margin-top: 0.1rem;">${usage.error || 'Check bucket settings'}</p>
        <button onclick="refreshStorageWidget()" style="background: none; border: none; color: var(--accent-cyan); cursor: pointer; font-size: 0.7rem; padding: 0; margin-top: 0.2rem;">🔄 Retry</button>
      </div>`;
    return;
  }

  const pct = usage.percentUsed;
  const usedMB = usage.usedMB.toFixed(1);
  const color = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981";
  const barGrad = pct >= 90
    ? "linear-gradient(90deg, #ef4444, #dc2626)"
    : pct >= 70
    ? "linear-gradient(90deg, #f59e0b, #d97706)"
    : "linear-gradient(90deg, #10b981, #06b6d4)";

  el.innerHTML = `
    <div class="stat-widget-icon" style="background: rgba(16,185,129,0.15); color: ${color};">📦</div>
    <div class="stat-widget-info" style="width: 100%;">
      <h3 style="color: ${color}; font-size: 1rem;">${usedMB} MB <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">/ 1 GB</span></h3>
      <p>Supabase Storage (Live)</p>
      <div style="margin-top: 0.4rem; background: rgba(255,255,255,0.06); border-radius: 99px; height: 5px; overflow: hidden; width: 100%;">
        <div style="height: 100%; width: ${pct}%; background: ${barGrad}; border-radius: 99px; transition: width 0.6s;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.3rem; font-size: 0.7rem; color: var(--text-dim);">
        <span>${pct}% used • ${usage.fileCount} file(s) in cloud</span>
        <button onclick="refreshStorageWidget()" style="background: none; border: none; color: var(--accent-cyan); cursor: pointer; font-size: 0.7rem; padding: 0;">🔄 Refresh</button>
      </div>
    </div>`;
}

/* ==========================================================================
   4.1. 3D THEME STUDIO CONTROLLER
   ========================================================================== */
function renderAdminThemeCards(activeTheme) {
  const currentTheme = activeTheme || (window.PortfolioData ? window.PortfolioData.getActiveTheme() : "cyber-dark");
  const themeCards = document.querySelectorAll(".theme-card-3d");
  
  themeCards.forEach(card => {
    const cardId = card.id; // e.g. "theme-card-cyber-dark"
    const themeKey = cardId.replace("theme-card-", "");
    const btn = card.querySelector(".btn-theme-activate");
    
    if (themeKey === currentTheme) {
      card.classList.add("active");
      if (btn) btn.innerHTML = "<span>✓ Currently Active Theme</span>";
    } else {
      card.classList.remove("active");
      if (btn) {
        if (themeKey === "cyber-dark") btn.innerHTML = "<span>✨ Apply Cyber Dark</span>";
        else if (themeKey === "luxury-white") btn.innerHTML = "<span>✨ Apply Luxury White</span>";
        else if (themeKey === "midnight-gold") btn.innerHTML = "<span>✨ Apply Apex Purple &amp; Gold</span>";
      }
    }
  });
}

window.handleSwitchTheme = function(themeId) {
  if (!window.PortfolioData) return;
  const active = window.PortfolioData.updateActiveTheme(themeId);
  renderAdminThemeCards(active);
  
  const themeNames = {
    "cyber-dark": "Cyber Neon Dark",
    "luxury-white": "Luxury Pearl White",
    "midnight-gold": "Royal Apex Purple & Gold"
  };
  
  showToast(`🎭 Switched to "${themeNames[themeId] || themeId}" Theme! Live site updated.`);
};

function renderProjectsTable(projects) {
  const overviewTbody = document.getElementById("overview-projects-table-body");
  const fullTbody = document.getElementById("full-projects-table-body");

  const rowHtml = projects.map(p => {
    const revCount = (p.reviews || []).length;
    const subLabel = p.subCategoryName || p.subCategory || "Work";
    return `
      <tr>
        <td>
          <img src="${p.image}" class="project-table-thumb" alt="${p.title}">
        </td>
        <td>
          <strong>${p.title}</strong>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.2rem;">
            ${(p.tags || []).slice(0, 3).join(", ")} ${p.images && p.images.length > 1 ? `• 📸 ${p.images.length} images` : ''} ${p.videoFile ? '• 🎬 MP4' : (p.videoUrl ? '• 📺 YouTube' : '')}
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <span style="font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 6px; background: rgba(139,92,246,0.15); color: #c084fc; font-weight: 700; width: fit-content;">
              ${p.categoryName || p.category}
            </span>
            <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 600;">
              ${subLabel}
            </span>
          </div>
        </td>
        <td>
          <div style="font-size: 0.85rem;">${p.client || "Client"}</div>
          <div style="font-size: 0.75rem; color: #fbbf24;">★ ${revCount} Reviews</div>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" onclick="openEditProjectModal('${p.id}')" title="Edit Project">✏️</button>
            <button class="btn-icon-action delete" onclick="handleDeleteProject('${p.id}')" title="Delete Project">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  if (overviewTbody) overviewTbody.innerHTML = projects.slice(0, 4).map(p => `
    <tr>
      <td><img src="${p.image}" class="project-table-thumb" alt="${p.title}"></td>
      <td><strong>${p.title}</strong></td>
      <td><span style="color: var(--accent-cyan); font-weight: 700;">${p.subCategoryName || p.categoryName || p.category}</span></td>
      <td>${p.client || "Client"}</td>
      <td>
        <button class="btn-icon-action" onclick="openEditProjectModal('${p.id}')">✏️</button>
      </td>
    </tr>
  `).join("");

  if (fullTbody) fullTbody.innerHTML = rowHtml;
}

/* ==========================================================================
   5. SERVICES MANAGER (FULL CRUD CONTROLLER)
   ========================================================================== */
function renderAdminServices(services) {
  const container = document.getElementById("admin-services-list");
  if (!container) return;

  container.innerHTML = services.map(s => {
    const theme = s.theme || "gold";
    const tools = (s.tools || []).map(t => (typeof t === 'string' ? t : t.name)).join(", ");

    return `
      <div style="background: var(--admin-card); border: 1px solid var(--admin-border); border-radius: 18px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span style="font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 9999px; background: rgba(255,255,255,0.06); color: #fff;">
              ${s.badge || 'Specialist'}
            </span>
            <span style="font-size: 0.75rem; color: var(--accent-${theme === 'gold' ? 'amber' : (theme === 'cyan' ? 'cyan' : 'rose')}); font-weight: 700; text-transform: uppercase;">
              ${theme} Theme
            </span>
          </div>

          <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${s.title}</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">${s.shortDesc}</p>

          <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem;">
            ${(s.features || []).map(f => `<span style="font-size: 0.72rem; background: rgba(255,255,255,0.03); border: 1px solid var(--admin-border); padding: 0.2rem 0.5rem; border-radius: 6px; color: #cbd5e1;">${f}</span>`).join("")}
          </div>

          <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.5rem;">
            <strong>Tools:</strong> ${tools || 'Standard Tools'}
          </div>
          <div style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">
            Proficiency: ${s.proficiency || 90}%
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--admin-border);">
          <button class="btn-admin btn-admin-secondary" style="flex-grow: 1; padding: 0.45rem;" onclick="openEditServiceModal('${s.id}')">✏️ Edit Service</button>
          <button class="btn-icon-action delete" onclick="handleDeleteService('${s.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
}

let currentServiceImages = [];

function renderServiceImagesPreview() {
  const container = document.getElementById("service-images-preview-grid");
  if (!container) return;

  if (currentServiceImages.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; font-size: 0.8rem; color: var(--text-dim); margin: 0.3rem 0;">No showcase images attached yet.</p>`;
    return;
  }

  container.innerHTML = currentServiceImages.map((img, idx) => `
    <div style="position: relative; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; border: 1px solid var(--admin-border); background: #000;">
      <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
      <button type="button" onclick="removeServiceImage(${idx})" style="position: absolute; top: 3px; right: 3px; background: rgba(239,68,68,0.85); color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
    </div>
  `).join("");
}

window.handleServiceImagesUpload = async function(event) {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;

  const useStorage = (typeof window.supabaseUploadFile === "function" && window.isSupabaseConfigured());

  if (useStorage) {
    showToast(`⏳ Uploading ${files.length} service image(s)...`);
    let uploaded = 0;
    for (const file of files) {
      const res = await window.supabaseUploadFile(file);
      if (res.success) {
        currentServiceImages.push(res.url);
        uploaded++;
      } else {
        showToast(`⚠️ Supabase Storage (${res.error}). Saving optimized image.`);
        await new Promise(resolve => {
          compressImageFile(file, 1000, 600, 0.85, function(compressedUrl) {
            currentServiceImages.push(compressedUrl);
            uploaded++;
            resolve();
          });
        });
      }
    }
    renderServiceImagesPreview();
    if (uploaded > 0) showToast(`✅ ${uploaded} service image(s) processed!`);
    refreshStorageWidget();
  } else {
    let loadedCount = 0;
    files.forEach(file => {
      compressImageFile(file, 1000, 600, 0.85, function(compressedUrl) {
        currentServiceImages.push(compressedUrl);
        loadedCount++;
        if (loadedCount === files.length) {
          renderServiceImagesPreview();
          showToast(`📸 Added ${files.length} showcase banner(s)!`);
        }
      });
    });
  }
};

window.addServiceImageFromUrl = function() {
  const urlInput = document.getElementById("srv-single-url-input");
  const url = urlInput.value.trim();
  if (url) {
    currentServiceImages.push(url);
    urlInput.value = "";
    renderServiceImagesPreview();
    showToast("📸 Image URL added!");
  }
};

window.removeServiceImage = async function(index) {
  const removed = currentServiceImages.splice(index, 1)[0];
  renderServiceImagesPreview();
  // Delete from Supabase Storage if it's a storage URL
  if (removed && typeof window.supabaseExtractFilePath === "function") {
    const filePath = window.supabaseExtractFilePath(removed);
    if (filePath && typeof window.supabaseDeleteFile === "function") {
      await window.supabaseDeleteFile(filePath);
      refreshStorageWidget();
    }
  }
};

window.openAddServiceModal = function() {
  document.getElementById("service-modal-heading").textContent = "Add New Service Offering";
  document.getElementById("service-edit-form").reset();
  document.getElementById("edit-service-id").value = "";
  document.getElementById("srv-prof-display").textContent = "95";
  currentServiceImages = [];
  renderServiceImagesPreview();
  document.getElementById("service-edit-modal").style.display = "flex";
};

window.openEditServiceModal = function(id) {
  const service = window.PortfolioData.getServiceById(id);
  if (!service) return;

  document.getElementById("service-modal-heading").textContent = "Edit: " + service.title;
  document.getElementById("edit-service-id").value = service.id;
  document.getElementById("srv-input-title").value = service.title;
  document.getElementById("srv-input-badge").value = service.badge || "Specialist";
  document.getElementById("srv-input-theme").value = service.theme || "gold";
  document.getElementById("srv-input-icon").value = service.icon || "pen-tool";
  document.getElementById("srv-input-desc").value = service.shortDesc || "";
  document.getElementById("srv-input-features").value = (service.features || []).join("\n");
  document.getElementById("srv-input-tools").value = (service.tools || []).map(t => (typeof t === 'string' ? t : t.name)).join(", ");
  document.getElementById("srv-input-proficiency").value = service.proficiency || 90;
  document.getElementById("srv-prof-display").textContent = service.proficiency || 90;

  currentServiceImages = Array.isArray(service.images) && service.images.length > 0 
    ? [...service.images] 
    : (service.image ? [service.image] : []);
  renderServiceImagesPreview();

  document.getElementById("service-edit-modal").style.display = "flex";
};

window.closeServiceModal = function() {
  document.getElementById("service-edit-modal").style.display = "none";
};

window.handleSaveService = function(event) {
  event.preventDefault();
  const id = document.getElementById("edit-service-id").value;
  const title = document.getElementById("srv-input-title").value.trim();
  const badge = document.getElementById("srv-input-badge").value.trim();
  const theme = document.getElementById("srv-input-theme").value;
  const icon = document.getElementById("srv-input-icon").value;
  const shortDesc = document.getElementById("srv-input-desc").value.trim();
  const features = document.getElementById("srv-input-features").value.split("\n").map(f => f.trim()).filter(Boolean);
  const toolsRaw = document.getElementById("srv-input-tools").value.split(",").map(t => t.trim()).filter(Boolean);
  const proficiency = parseInt(document.getElementById("srv-input-proficiency").value) || 90;

  const toolColorMap = {
    "Photoshop": "#31a8ff",
    "Illustrator": "#ff9a00",
    "Canva": "#00c4cc",
    "Figma": "#a259ff",
    "Adobe XD": "#ff61f6",
    "HTML5": "#ea580c",
    "Premiere Pro": "#9999ff",
    "After Effects": "#c880ff",
    "CapCut": "#00d2c4"
  };

  const tools = toolsRaw.map(t => {
    let color = "#3b82f6";
    for (const [key, c] of Object.entries(toolColorMap)) {
      if (t.toLowerCase().includes(key.toLowerCase())) {
        color = c;
        break;
      }
    }
    return { name: t, color };
  });

  const finalImages = currentServiceImages.length > 0 ? currentServiceImages : ["assets/images/project_apex_branding.svg"];

  const payload = {
    title,
    badge,
    theme,
    icon,
    shortDesc,
    features,
    tools,
    proficiency,
    image: finalImages[0],
    images: finalImages,
    ribbon: ""
  };

  if (id) {
    window.PortfolioData.updateService(id, payload);
    showToast("✅ Service updated successfully!");
  } else {
    window.PortfolioData.addService(payload);
    showToast("🎉 New service created!");
  }

  closeServiceModal();
  loadDashboardData();
};

window.handleDeleteService = async function(id) {
  const service = window.PortfolioData.getServiceById(id);
  if (!service) return;

  if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
    // Collect all service image URLs
    const allUrls = [];
    if (service.images && service.images.length > 0) allUrls.push(...service.images);
    else if (service.image) allUrls.push(service.image);

    // Delete from Supabase Storage
    if (typeof window.supabaseDeleteFilesFromUrls === "function") {
      await window.supabaseDeleteFilesFromUrls(allUrls);
    }

    window.PortfolioData.deleteService(id);
    showToast("🗑️ Service + Storage files deleted!");
    loadDashboardData();
    refreshStorageWidget();
  }
};

/* ==========================================================================
   6. PROJECT MODAL (SUBCATEGORIES, MULTI-IMAGE & DUAL VIDEO UPLOADER)
   ========================================================================== */
window.handleModalCategoryChange = function() {
  const cat = document.getElementById("proj-input-category")?.value || "graphics";
  handleAdminCategoryChange(cat, "thumbnail");
};

window.handleModalSubCategoryChange = function() {
  const sub = document.getElementById("proj-input-subcategory")?.value || "thumbnail";
  handleAdminSubcategoryChange(sub);
};

window.handleAdminCategoryChange = function(cat, selectedSub = "thumbnail") {
  const subSelect = document.getElementById("proj-input-subcategory");
  if (!subSelect) return;

  const options = SUBCATEGORY_OPTIONS[cat] || SUBCATEGORY_OPTIONS.graphics;
  subSelect.innerHTML = options.map(opt => `
    <option value="${opt.id}">${opt.name}</option>
  `).join("");

  if (selectedSub) {
    subSelect.value = selectedSub;
  }
  handleAdminSubcategoryChange(subSelect.value);
};

window.handleAdminSubcategoryChange = function(subVal) {
  const customGroup = document.getElementById("custom-subcategory-group") || document.getElementById("proj-custom-subcategory-row");
  if (customGroup) {
    if (subVal === "custom") {
      customGroup.style.display = "block";
    } else {
      customGroup.style.display = "none";
    }
  }
};

window.openAddProjectModal = function() {
  document.getElementById("project-modal-heading").textContent = "Add New Portfolio Work";
  document.getElementById("project-edit-form").reset();
  document.getElementById("edit-project-id").value = "";
  
  handleAdminCategoryChange("graphics", "thumbnail");
  document.getElementById("proj-input-custom-sub").value = "";
  document.getElementById("proj-input-featured").checked = true;

  currentProjectImages = [];
  currentThumbnailImage = "";
  currentProjectVideoFile = "";
  document.getElementById("proj-video-filename").textContent = "";
  document.getElementById("proj-input-video").value = "";
  updateAdminProjectVideoPreview();
  renderProjectImagesPreview();
  document.getElementById("project-edit-modal").style.display = "flex";
};

window.openEditProjectModal = function(id) {
  const project = window.PortfolioData.getProjectById(id);
  if (!project) return;

  document.getElementById("project-modal-heading").textContent = "Edit: " + project.title;
  document.getElementById("edit-project-id").value = project.id;
  document.getElementById("proj-input-title").value = project.title;
  document.getElementById("proj-input-category").value = project.category;
  
  handleAdminCategoryChange(project.category, project.subCategory || "thumbnail");
  if (project.subCategory === "custom") {
    document.getElementById("proj-input-custom-sub").value = project.subCategoryName || "";
  }

  document.getElementById("proj-input-featured").checked = Boolean(project.featured);
  document.getElementById("proj-input-duration").value = project.duration || "";
  document.getElementById("proj-input-video").value = project.videoUrl || "";
  document.getElementById("proj-input-client").value = project.client || "";
  document.getElementById("proj-input-tools").value = (project.tools || []).join(", ");
  document.getElementById("proj-input-tags").value = (project.tags || []).join(", ");
  document.getElementById("proj-input-desc").value = project.description || "";

  currentProjectVideoFile = project.videoFile || "";
  document.getElementById("proj-video-filename").textContent = currentProjectVideoFile ? "Attached Video File" : "";
  updateAdminProjectVideoPreview();

  currentProjectImages = Array.isArray(project.images) && project.images.length > 0
    ? [...project.images]
    : [project.image || "assets/images/project_placeholder.svg"];
  currentThumbnailImage = project.image || currentProjectImages[0];

  renderProjectImagesPreview();
  document.getElementById("project-edit-modal").style.display = "flex";
};

window.closeProjectModal = function() {
  document.getElementById("project-edit-modal").style.display = "none";
};

// Handle Multi-file Upload — uploads to Supabase Storage if configured, else fallback to base64
window.handleMultipleImageUpload = async function(event) {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;

  const useStorage = (typeof window.supabaseUploadFile === "function" && window.isSupabaseConfigured());

  if (useStorage) {
    showToast(`⏳ Uploading ${files.length} project image(s)...`);
    let uploaded = 0;
    for (const file of files) {
      const res = await window.supabaseUploadFile(file);
      if (res.success) {
        currentProjectImages.push(res.url);
        if (!currentThumbnailImage) currentThumbnailImage = res.url;
        uploaded++;
      } else {
        showToast(`⚠️ Supabase Storage (${res.error}). Saving optimized image.`);
        await new Promise(resolve => {
          compressImageFile(file, 1200, 800, 0.85, function(base64Url) {
            currentProjectImages.push(base64Url);
            if (!currentThumbnailImage) currentThumbnailImage = base64Url;
            uploaded++;
            resolve();
          });
        });
      }
    }
    renderProjectImagesPreview();
    if (uploaded > 0) showToast(`✅ ${uploaded} project image(s) processed!`);
    // Refresh storage usage widget
    refreshStorageWidget();
  } else {
    // Fallback: base64 (offline / Supabase not configured)
    let loadedCount = 0;
    files.forEach(file => {
      compressImageFile(file, 1200, 800, 0.85, function(base64Url) {
        currentProjectImages.push(base64Url);
        if (!currentThumbnailImage) currentThumbnailImage = base64Url;
        loadedCount++;
        if (loadedCount === files.length) {
          renderProjectImagesPreview();
          showToast(`📸 Added ${files.length} images (base64 mode)!`);
        }
      });
    });
  }
};

window.handleVideoFileUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    currentProjectVideoFile = e.target.result;
    document.getElementById("proj-video-filename").textContent = `Attached: ${file.name}`;
    updateAdminProjectVideoPreview();
    showToast(`🎬 Video attached: ${file.name}`);
  };
  reader.readAsDataURL(file);
};

window.removeAttachedVideoFile = function() {
  currentProjectVideoFile = "";
  const fnEl = document.getElementById("proj-video-filename");
  if (fnEl) fnEl.textContent = "";
  const fileInput = document.getElementById("proj-video-file-input");
  if (fileInput) fileInput.value = "";
  updateAdminProjectVideoPreview();
  showToast("🗑️ Attached video file removed.");
};

window.useYouTubeThumbnailAsCover = function() {
  const urlInput = document.getElementById("proj-input-video");
  if (!urlInput) return;
  const url = urlInput.value.trim();
  const videoId = (url && window.YouTubeHelper) ? window.YouTubeHelper.extractVideoId(url) : null;
  if (!videoId) {
    showToast("⚠️ Please enter a valid YouTube video link first.");
    return;
  }
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  currentThumbnailImage = thumbUrl;
  if (!currentProjectImages.includes(thumbUrl)) {
    currentProjectImages.unshift(thumbUrl);
  }
  renderProjectImagesPreview();
  showToast("📸 High-Res YouTube thumbnail set as project cover!");
};

window.updateAdminProjectVideoPreview = function() {
  const previewBox = document.getElementById("proj-video-preview-box");
  if (!previewBox) return;

  const urlInput = document.getElementById("proj-input-video");
  const url = urlInput ? urlInput.value.trim() : "";
  const hasFile = Boolean(currentProjectVideoFile && currentProjectVideoFile.length > 0);
  const videoId = (url && window.YouTubeHelper) ? window.YouTubeHelper.extractVideoId(url) : null;

  const removeBtn = document.getElementById("btn-remove-video-file");
  if (removeBtn) {
    removeBtn.style.display = hasFile ? "inline-flex" : "none";
  }

  if (videoId) {
    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <div style="margin-top:0.8rem; padding:0.8rem; background:rgba(6,182,212,0.06); border:1px solid rgba(6,182,212,0.3); border-radius:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <span style="font-size:0.82rem; font-weight:700; color:var(--accent-cyan);">
            ✅ YouTube Video Connected (ID: <code>${videoId}</code>)
          </span>
          <button type="button" class="btn-admin btn-admin-secondary" style="font-size:0.75rem; padding:0.25rem 0.6rem;" onclick="useYouTubeThumbnailAsCover()">
            📸 Use YouTube Thumbnail as Cover
          </button>
        </div>
        <div style="aspect-ratio:16/9; width:100%; border-radius:8px; overflow:hidden; background:#000;">
          ${window.YouTubeHelper.createIframeHtml(url, "Preview Video", { autoplay: 0, controls: true })}
        </div>
        <p style="font-size:0.75rem; color:var(--text-dim); margin-top:0.4rem;">
          💡 Works with watch links, youtu.be, shorts, and embed URLs automatically!
        </p>
      </div>
    `;
  } else if (hasFile) {
    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <div style="margin-top:0.8rem; padding:0.8rem; background:rgba(139,92,246,0.06); border:1px solid rgba(139,92,246,0.3); border-radius:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
          <span style="font-size:0.82rem; font-weight:700; color:var(--accent-violet);">📁 Attached Local Video File</span>
          <button type="button" class="btn-admin btn-admin-secondary" style="font-size:0.75rem; padding:0.25rem 0.6rem; color:#ef4444;" onclick="removeAttachedVideoFile()">❌ Remove File</button>
        </div>
        <div style="aspect-ratio:16/9; width:100%; border-radius:8px; overflow:hidden; background:#000;">
          <video src="${currentProjectVideoFile}" controls style="width:100%; height:100%; object-fit:contain;"></video>
        </div>
      </div>
    `;
  } else if (url.length > 0) {
    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <div style="margin-top:0.8rem; padding:0.6rem; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:10px; font-size:0.8rem; color:#fca5a5;">
        ⚠️ Unrecognized link. Enter a YouTube URL (e.g. <code>https://youtube.com/watch?v=...</code> or <code>https://youtu.be/...</code> or <code>https://youtube.com/shorts/...</code>)
      </div>
    `;
  } else {
    previewBox.style.display = "none";
    previewBox.innerHTML = "";
  }
};

window.updateHubFeaturedVideoPreview = function() {
  const previewBox = document.getElementById("hub-yt-video-preview");
  if (!previewBox) return;

  const input = document.getElementById("hub-yt-video");
  const val = input ? input.value.trim() : "";
  const videoId = (val && window.YouTubeHelper) ? window.YouTubeHelper.extractVideoId(val) : null;

  if (videoId) {
    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <div style="margin-top:0.8rem; padding:0.8rem; background:rgba(255,0,0,0.06); border:1px solid rgba(255,0,0,0.3); border-radius:12px;">
        <div style="font-size:0.82rem; font-weight:700; color:#ff4444; margin-bottom:0.5rem;">
          📺 YouTube Showcase Player Live Preview (ID: <code>${videoId}</code>)
        </div>
        <div style="aspect-ratio:16/9; width:100%; border-radius:8px; overflow:hidden; background:#000;">
          ${window.YouTubeHelper.createIframeHtml(val, "Featured Preview", { autoplay: 0, controls: true })}
        </div>
      </div>
    `;
  } else if (val.length > 0) {
    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <div style="margin-top:0.8rem; padding:0.6rem; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.3); border-radius:10px; font-size:0.8rem; color:#fca5a5;">
        ⚠️ Unrecognized link. Enter a YouTube URL (e.g. <code>https://youtube.com/watch?v=...</code> or <code>https://youtu.be/...</code>)
      </div>
    `;
  } else {
    previewBox.style.display = "none";
    previewBox.innerHTML = "";
  }
};

window.addImageFromUrl = function() {
  const urlInput = document.getElementById("proj-single-url-input");
  const url = urlInput.value.trim();
  if (url) {
    currentProjectImages.push(url);
    if (!currentThumbnailImage) currentThumbnailImage = url;
    urlInput.value = "";
    renderProjectImagesPreview();
    showToast("Added image URL!");
  }
};

window.setAsThumbnail = function(imgUrl) {
  currentThumbnailImage = imgUrl;
  renderProjectImagesPreview();
  showToast("⭐ Set as main thumbnail/banner!");
};

window.removeProjectImage = async function(index) {
  const removed = currentProjectImages.splice(index, 1)[0];
  if (currentThumbnailImage === removed) {
    currentThumbnailImage = currentProjectImages[0] || "";
  }
  renderProjectImagesPreview();
  // Delete from Supabase Storage if it's a storage URL
  if (removed && typeof window.supabaseExtractFilePath === "function") {
    const filePath = window.supabaseExtractFilePath(removed);
    if (filePath && typeof window.supabaseDeleteFile === "function") {
      await window.supabaseDeleteFile(filePath);
      refreshStorageWidget();
    }
  }
};

function renderProjectImagesPreview() {
  const container = document.getElementById("project-images-preview-grid");
  if (!container) return;

  if (currentProjectImages.length === 0) {
    container.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-dim); grid-column: 1 / -1;">No images uploaded yet.</p>`;
    return;
  }

  container.innerHTML = currentProjectImages.map((imgUrl, i) => {
    const isThumb = imgUrl === currentThumbnailImage;
    return `
      <div class="image-preview-card ${isThumb ? 'is-thumbnail' : ''}">
        <img src="${imgUrl}" alt="Preview ${i}">
        <button type="button" class="remove-img-btn" onclick="removeProjectImage(${i})" title="Remove image">✕</button>
        <button type="button" class="set-thumb-btn" onclick="setAsThumbnail('${imgUrl}')">
          ${isThumb ? '★ Main Thumbnail' : 'Set as Thumbnail'}
        </button>
      </div>
    `;
  }).join("");
}

window.handleSaveProject = function(event) {
  event.preventDefault();
  const id = document.getElementById("edit-project-id").value;
  const title = document.getElementById("proj-input-title").value.trim();
  const category = document.getElementById("proj-input-category").value;
  const subCategory = document.getElementById("proj-input-subcategory").value;
  const customSubName = document.getElementById("proj-input-custom-sub").value.trim();
  const featured = Boolean(document.getElementById("proj-input-featured").checked);

  // Determine human readable subcategory name
  let subCategoryName = "Work";
  if (subCategory === "custom" && customSubName) {
    subCategoryName = customSubName;
  } else {
    const options = SUBCATEGORY_OPTIONS[category] || [];
    const found = options.find(o => o.id === subCategory);
    if (found) subCategoryName = found.name.replace(/^[^\w]+/, "").trim();
  }

  const categoryNames = {
    graphics: "Graphic Design",
    video: "Video Editing",
    uiux: "UI/UX & Web"
  };

  const duration = document.getElementById("proj-input-duration").value.trim();
  let videoUrl = document.getElementById("proj-input-video").value.trim();
  if (videoUrl && window.YouTubeHelper) {
    const embed = window.YouTubeHelper.getEmbedUrl(videoUrl);
    if (embed) {
      videoUrl = embed;
    }
  }

  const client = document.getElementById("proj-input-client").value.trim();
  const tools = document.getElementById("proj-input-tools").value;
  const tags = document.getElementById("proj-input-tags").value;
  const description = document.getElementById("proj-input-desc").value.trim();

  // If no custom image was provided but YouTube link exists, use YouTube HD thumbnail as cover!
  let autoThumb = (videoUrl && window.YouTubeHelper) ? window.YouTubeHelper.getThumbnailUrl(videoUrl, "maxresdefault") : "";
  const finalImages = currentProjectImages.length > 0 
    ? currentProjectImages 
    : (autoThumb ? [autoThumb] : ["assets/images/project_placeholder.svg"]);
  const finalThumb = currentThumbnailImage || finalImages[0];

  const projectPayload = {
    title,
    category,
    categoryName: categoryNames[category] || "Design",
    subCategory,
    subCategoryName,
    featured,
    duration,
    image: finalThumb,
    images: finalImages,
    videoUrl,
    videoFile: currentProjectVideoFile,
    client,
    tools,
    tags,
    description
  };

  if (id) {
    window.PortfolioData.updateProject(id, projectPayload);
    showToast("✅ Project updated successfully!");
  } else {
    window.PortfolioData.addProject(projectPayload);
    showToast("🎉 New project added to portfolio!");
  }

  closeProjectModal();
  loadDashboardData();
};

window.handleDeleteProject = async function(id) {
  const project = window.PortfolioData.getProjectById(id);
  if (!project) return;

  if (confirm(`Are you sure you want to completely delete "${project.title}" from your portfolio database?`)) {
    // Collect all image URLs for this project
    const allUrls = [];
    if (project.images && project.images.length > 0) allUrls.push(...project.images);
    else if (project.image) allUrls.push(project.image);

    // Delete from Supabase Storage (storage URLs only, base64 is skipped)
    if (typeof window.supabaseDeleteFilesFromUrls === "function") {
      await window.supabaseDeleteFilesFromUrls(allUrls);
    }

    window.PortfolioData.deleteProject(id);
    showToast("🗑️ Project + Storage files deleted!");
    loadDashboardData();
    refreshStorageWidget();
  }
};

/* ==========================================================================
   7. PROFILE & SOCIAL HUB CONTROLLER
   ========================================================================== */
let currentAboutImage = "assets/images/avatar.svg";

window.handleAboutImageUpload = async function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const useStorage = (typeof window.supabaseUploadFile === "function" && window.isSupabaseConfigured());

  if (useStorage) {
    showToast("⏳ Uploading profile photo to Supabase Storage...");
    const res = await window.supabaseUploadFile(file, `profile/about_${Date.now()}.${file.name.split('.').pop()}`);
    if (res.success) {
      currentAboutImage = res.url;
      const preview = document.getElementById("prof-about-img-preview");
      if (preview) preview.src = currentAboutImage;
      const urlInput = document.getElementById("prof-about-img-url");
      if (urlInput) urlInput.value = res.url;
      showToast("✅ Profile photo uploaded to Supabase Storage!");
      refreshStorageWidget();
    } else {
      showToast(`⚠️ Upload failed: ${res.error}. Using local mode.`);
      compressImageFile(file, 800, 800, 0.85, function(compressedDataUrl) {
        currentAboutImage = compressedDataUrl;
        const preview = document.getElementById("prof-about-img-preview");
        if (preview) preview.src = currentAboutImage;
        const urlInput = document.getElementById("prof-about-img-url");
        if (urlInput) urlInput.value = "";
      });
    }
  } else {
    compressImageFile(file, 800, 800, 0.85, function(compressedDataUrl) {
      currentAboutImage = compressedDataUrl;
      const preview = document.getElementById("prof-about-img-preview");
      if (preview) preview.src = currentAboutImage;
      const urlInput = document.getElementById("prof-about-img-url");
      if (urlInput) urlInput.value = "";
      showToast("📸 About section photo loaded & optimized!");
    });
  }
};

window.handleAboutImageUrlInput = function(url) {
  const clean = url ? url.trim() : "";
  if (clean) {
    currentAboutImage = clean;
    const preview = document.getElementById("prof-about-img-preview");
    if (preview) preview.src = clean;
  }
};

function loadProfileFormData(profile, socialHub) {
  if (profile) {
    document.getElementById("prof-name").value = profile.name || "";
    document.getElementById("prof-title").value = profile.title || "";
    document.getElementById("prof-tagline").value = profile.tagline || "";
    document.getElementById("prof-fullbio").value = profile.fullBio || "";
    document.getElementById("prof-phone").value = profile.phone || "";
    document.getElementById("prof-whatsapp").value = profile.whatsapp || "";
    document.getElementById("prof-email").value = profile.email || "";
    document.getElementById("prof-location").value = profile.location || "";

    currentAboutImage = profile.aboutImage || profile.avatar || "assets/images/avatar.svg";
    const preview = document.getElementById("prof-about-img-preview");
    if (preview) preview.src = currentAboutImage;
    const urlInput = document.getElementById("prof-about-img-url");
    if (urlInput) {
      urlInput.value = profile.aboutImage && !profile.aboutImage.startsWith("data:") ? profile.aboutImage : "";
    }

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    setVal("prof-years-exp", profile.yearsExp || "3+");
    setVal("prof-projects-done", profile.projectsDone || "50+");
    setVal("prof-happy-clients", profile.happyClients || "40+");
    setVal("prof-client-satisfaction", profile.clientSatisfaction || "99%");

    const socials = profile.socials || {};
    setVal("prof-youtube", socials.youtube || (socialHub && socialHub.youtubeUrl) || "");
    setVal("prof-facebook", socials.facebook || "");
    setVal("prof-instagram", socials.instagram || (socialHub && socialHub.instagramUrl) || "");
    setVal("prof-linkedin", socials.linkedin || "");
    setVal("prof-twitter", socials.twitter || socials.x || "");
    setVal("prof-behance", socials.behance || (socialHub && socialHub.behanceUrl) || "");
    setVal("prof-dribbble", socials.dribbble || (socialHub && socialHub.dribbbleUrl) || "");
    setVal("prof-github", socials.github || "");

    renderCustomSocialRows(profile.customSocials || []);
  }

  if (socialHub) {
    document.getElementById("hub-yt-title").value = socialHub.youtubeTitle || "";
    document.getElementById("hub-yt-handle").value = socialHub.youtubeHandle || "";
    document.getElementById("hub-yt-url").value = socialHub.youtubeUrl || (profile && profile.socials && profile.socials.youtube) || "";
    document.getElementById("hub-yt-subs").value = socialHub.subscribersCount || "10K+";
    document.getElementById("hub-yt-video").value = socialHub.featuredVideoEmbed || "";
    // Load toggle state (default to true if not set)
    const toggle = document.getElementById("hub-show-youtube-toggle");
    if (toggle) toggle.checked = socialHub.showYouTubeHub !== false;
    updateHubFeaturedVideoPreview();
  }
}

function renderCustomSocialRows(customSocials) {
  const container = document.getElementById("custom-socials-container");
  if (!container) return;

  container.innerHTML = customSocials.map((cs, index) => `
    <div class="custom-social-row" data-index="${index}">
      <input type="text" class="form-control-admin cs-name" placeholder="Platform (e.g. Twitter)" value="${cs.name || ''}" style="width: 140px;">
      <input type="url" class="form-control-admin cs-url" placeholder="Profile URL" value="${cs.url || ''}" style="flex-grow: 1;">
      <input type="text" class="form-control-admin cs-icon" placeholder="Icon (e.g. 🐦)" value="${cs.icon || '🔗'}" style="width: 70px; text-align: center;">
      <button type="button" class="btn-delete-row" onclick="removeCustomSocialRow(${index})" title="Remove Channel">✕</button>
    </div>
  `).join("");
}

window.addCustomSocialRow = function() {
  const container = document.getElementById("custom-socials-container");
  if (!container) return;

  const newRow = document.createElement("div");
  newRow.className = "custom-social-row";
  newRow.innerHTML = `
    <input type="text" class="form-control-admin cs-name" placeholder="Platform (e.g. Twitter)" value="" style="width: 140px;">
    <input type="url" class="form-control-admin cs-url" placeholder="Profile URL" value="" style="flex-grow: 1;">
    <input type="text" class="form-control-admin cs-icon" placeholder="Icon" value="🔗" style="width: 70px; text-align: center;">
    <button type="button" class="btn-delete-row" onclick="this.parentElement.remove()" title="Remove Channel">✕</button>
  `;
  container.appendChild(newRow);
};

window.removeCustomSocialRow = function(index) {
  const data = window.PortfolioData.get();
  if (data.profile && data.profile.customSocials) {
    data.profile.customSocials.splice(index, 1);
    window.PortfolioData.updateProfile({ customSocials: data.profile.customSocials });
    renderCustomSocialRows(data.profile.customSocials);
  }
};

window.handleSaveProfile = function(event) {
  event.preventDefault();

  // Harvest custom socials
  const customRows = document.querySelectorAll(".custom-social-row");
  const customSocials = [];
  customRows.forEach(row => {
    const name = row.querySelector(".cs-name").value.trim();
    const url = row.querySelector(".cs-url").value.trim();
    const icon = row.querySelector(".cs-icon").value.trim() || "🔗";
    if (name && url) {
      customSocials.push({ name, url, icon });
    }
  });

  const aboutUrlInput = document.getElementById("prof-about-img-url");
  const aboutUrlVal = aboutUrlInput ? aboutUrlInput.value.trim() : "";
  const finalAboutImg = aboutUrlVal || currentAboutImage || "assets/images/avatar.svg";

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  const socials = {};
  const ytVal = getVal("prof-youtube") || getVal("hub-yt-url");
  if (ytVal) socials.youtube = ytVal;
  const fbVal = getVal("prof-facebook");
  if (fbVal) socials.facebook = fbVal;
  const instaVal = getVal("prof-instagram");
  if (instaVal) socials.instagram = instaVal;
  const liVal = getVal("prof-linkedin");
  if (liVal) socials.linkedin = liVal;
  const twVal = getVal("prof-twitter");
  if (twVal) socials.twitter = twVal;
  const beVal = getVal("prof-behance");
  if (beVal) socials.behance = beVal;
  const drVal = getVal("prof-dribbble");
  if (drVal) socials.dribbble = drVal;
  const ghVal = getVal("prof-github");
  if (ghVal) socials.github = ghVal;

  const rawWa = getVal("prof-whatsapp");
  if (rawWa) {
    const cleanWa = rawWa.replace(/\D/g, "");
    socials.whatsapp = `https://wa.me/91${cleanWa}`;
  }

  const profileUpdates = {
    name: getVal("prof-name"),
    title: getVal("prof-title"),
    tagline: getVal("prof-tagline"),
    fullBio: getVal("prof-fullbio"),
    yearsExp: getVal("prof-years-exp") || "3+",
    projectsDone: getVal("prof-projects-done") || "50+",
    happyClients: getVal("prof-happy-clients") || "40+",
    clientSatisfaction: getVal("prof-client-satisfaction") || "99%",
    aboutImage: finalAboutImg,
    avatar: finalAboutImg,
    phone: getVal("prof-phone"),
    displayPhone: "+91 " + getVal("prof-phone"),
    whatsapp: rawWa,
    displayWhatsapp: "+91 " + rawWa,
    email: getVal("prof-email"),
    location: getVal("prof-location"),
    socials,
    customSocials
  };

  let featVideo = getVal("hub-yt-video");
  if (featVideo && window.YouTubeHelper) {
    const embed = window.YouTubeHelper.getEmbedUrl(featVideo, { autoplay: 0 });
    if (embed) {
      featVideo = embed;
    }
  }

  const showYouTubeHub = document.getElementById("hub-show-youtube-toggle")?.checked !== false;

  const socialHubUpdates = {
    showYouTubeHub,
    youtubeTitle: getVal("hub-yt-title"),
    youtubeHandle: getVal("hub-yt-handle"),
    youtubeUrl: ytVal,
    subscribersCount: getVal("hub-yt-subs"),
    featuredVideoEmbed: featVideo,
    instagramUrl: instaVal,
    behanceUrl: beVal,
    dribbbleUrl: drVal,
    whatsappUrl: socials.whatsapp || ""
  };

  window.PortfolioData.updateProfile(profileUpdates);
  window.PortfolioData.updateSocialHub(socialHubUpdates);
  showToast("💾 Profile, Stats & Social Hub saved!");
};

/**
 * Instantly toggle YouTube Hub visibility on portfolio site via the admin toggle.
 */
window.handleYouTubeHubToggle = function(checked) {
  window.PortfolioData.updateSocialHub({ showYouTubeHub: checked });
  showToast(checked ? "📺 YouTube Hub section is now VISIBLE on your site!" : "🚫 YouTube Hub section is now HIDDEN from your site.");
};

/* ==========================================================================
   8. SKILLS CONTROLLER (ADD, EDIT, DELETE)
   ========================================================================== */
function renderAdminSkills(skills) {
  const container = document.getElementById("admin-skills-list");
  if (!container) return;

  container.innerHTML = skills.map((sk, index) => `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--admin-border); border-radius: 14px; padding: 1.1rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="font-size: 0.95rem;">${sk.name}</strong>
        <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; margin-top: 0.2rem;">${sk.level}% Proficiency</div>
      </div>
      <div style="display: flex; gap: 0.4rem;">
        <button class="btn-icon-action" onclick="openSkillEditModal(${index})" title="Edit Skill">✏️</button>
        <button class="btn-icon-action delete" onclick="handleDeleteSkill('${sk.name}')" title="Delete Skill">✕</button>
      </div>
    </div>
  `).join("");
}

window.openSkillEditModal = function(index) {
  const skills = window.PortfolioData.getSkills();
  const skill = skills[index];
  if (!skill) return;

  document.getElementById("edit-skill-index").value = index;
  document.getElementById("edit-skill-name").value = skill.name;
  document.getElementById("edit-skill-level").value = skill.level;
  document.getElementById("skill-level-display").textContent = skill.level;
  document.getElementById("skill-edit-modal").style.display = "flex";
};

window.closeSkillEditModal = function() {
  document.getElementById("skill-edit-modal").style.display = "none";
};

window.handleSaveSkillEdit = function(event) {
  event.preventDefault();
  const index = parseInt(document.getElementById("edit-skill-index").value);
  const name = document.getElementById("edit-skill-name").value.trim();
  const level = parseInt(document.getElementById("edit-skill-level").value) || 90;

  if (name) {
    window.PortfolioData.updateSkill(index, { name, level });
    showToast("✅ Skill updated successfully!");
    closeSkillEditModal();
    loadDashboardData();
  }
};

window.handleAddSkill = function(event) {
  event.preventDefault();
  const name = document.getElementById("new-skill-name").value.trim();
  const level = parseInt(document.getElementById("new-skill-level").value) || 85;

  if (name) {
    window.PortfolioData.addSkill({ name, level, category: "graphics", icon: "brush" });
    showToast(`🚀 Added skill: ${name}`);
    document.getElementById("new-skill-name").value = "";
    loadDashboardData();
  }
};

window.handleDeleteSkill = function(skillName) {
  if (confirm(`Delete skill "${skillName}" from database?`)) {
    window.PortfolioData.deleteSkill(skillName);
    showToast(`Deleted skill: ${skillName}`);
    loadDashboardData();
  }
};

/* ==========================================================================
   9. CLIENT REVIEWS MODERATION
   ========================================================================== */
function renderAdminReviews(reviews) {
  const container = document.getElementById("admin-reviews-list");
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-dim); text-align: center; padding: 2rem;">No visitor reviews found.</p>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--admin-border); border-radius: 14px; padding: 1.2rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
      <div>
        <div style="display: flex; gap: 0.6rem; align-items: center; margin-bottom: 0.3rem;">
          <strong style="color: #fff;">${r.userName}</strong>
          <span style="color: #fbbf24; font-size: 0.8rem;">${"★".repeat(r.rating || 5)}</span>
          <span style="font-size: 0.75rem; color: var(--accent-cyan);">${r.projectTitle || 'Project'}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">"${r.comment}"</p>
        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.3rem;">${r.date || 'Recent'}</div>
      </div>
      <button class="btn-icon-action delete" onclick="handleDeleteReview('${r.projectId}', '${r.id}')" title="Delete Review">🗑️</button>
    </div>
  `).join("");
}

window.handleDeleteReview = function(projectId, reviewId) {
  if (confirm("Permanently delete this review from the database?")) {
    window.PortfolioData.deleteProjectReview(projectId, reviewId);
    showToast("🗑️ Review deleted.");
    loadDashboardData();
  }
};

/* ==========================================================================
   10. BACKUP, EXPORT, IMPORT & PIN SECURITY
   ========================================================================== */
window.exportDataJSON = function() {
  window.PortfolioData.exportJSON();
  showToast("💾 data.json downloaded! Commit this to your GitHub repo.");
};

window.handleImportJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const res = window.PortfolioData.importJSON(e.target.result);
    if (res.success) {
      showToast("🎉 Portfolio database restored successfully!");
      loadDashboardData();
    } else {
      alert("❌ Failed to import JSON: " + res.error);
    }
  };
  reader.readAsText(file);
};

window.handleChangePin = function(event) {
  event.preventDefault();
  const newPin = document.getElementById("new-admin-pin").value.trim();
  if (newPin.length >= 4) {
    window.PortfolioData.updatePin(newPin);
    showToast(`🔒 Admin PIN updated to ${newPin}!`);
    document.getElementById("new-admin-pin").value = "";
  } else {
    alert("PIN must be at least 4 characters.");
  }
};

window.handleResetData = function() {
  if (confirm("⚠️ Are you sure you want to reset all portfolio projects, services, and details to original defaults?")) {
    window.PortfolioData.reset();
    showToast("🔄 Portfolio data reset to defaults.");
    loadDashboardData();
  }
};

/* ==========================================================================
   11. SUPABASE CLOUD DATABASE & REALTIME SETTINGS CONTROLLER
   ========================================================================== */

/**
 * Check Supabase connection and update status badges & input values
 */
window.checkSupabaseStatus = async function() {
  const topbarBadge = document.getElementById("topbar-cloud-status");
  const mobileDot = document.getElementById("mobile-cloud-status-dot");
  const panelPill = document.getElementById("supabase-panel-status-pill");
  const sidebarWidget = document.getElementById("sidebar-cloud-widget");
  const sidebarText = document.getElementById("sidebar-cloud-status-text");
  const sidebarDot = document.getElementById("sidebar-cloud-status-dot");
  const urlInput = document.getElementById("cfg-supabase-url");
  const keyInput = document.getElementById("cfg-supabase-key");

  // Pre-fill existing config into inputs
  if (typeof window.getSupabaseConfig === "function") {
    const cfg = window.getSupabaseConfig();
    if (urlInput && !urlInput.value && cfg.url) urlInput.value = cfg.url;
    if (keyInput && !keyInput.value && cfg.anonKey) keyInput.value = cfg.anonKey;
  }

  const isConfigured = typeof window.isSupabaseConfigured === "function" && window.isSupabaseConfigured();

  if (!isConfigured) {
    if (topbarBadge) {
      topbarBadge.className = "cloud-status-badge offline";
      topbarBadge.innerHTML = `<span class="status-dot"></span> <span class="status-text">Local Storage Mode (Offline)</span>`;
    }
    if (mobileDot) {
      mobileDot.style.background = "#f59e0b";
      mobileDot.title = "Supabase Not Configured (Offline Mode)";
    }
    if (sidebarWidget) sidebarWidget.className = "sidebar-cloud-btn offline";
    if (sidebarText) {
      sidebarText.textContent = "Offline Mode";
      sidebarText.style.color = "#f59e0b";
    }
    if (sidebarDot) sidebarDot.style.background = "#f59e0b";
    if (panelPill) {
      panelPill.className = "cloud-status-pill offline";
      panelPill.textContent = "Offline / Local Mode";
    }
    return;
  }

  if (topbarBadge) {
    topbarBadge.className = "cloud-status-badge";
    topbarBadge.innerHTML = `<span class="status-dot"></span> <span class="status-text">Checking Supabase...</span>`;
  }
  if (sidebarText) {
    sidebarText.textContent = "Checking...";
    sidebarText.style.color = "#94a3b8";
  }
  if (sidebarDot) sidebarDot.style.background = "#94a3b8";

  // Test live connection
  if (typeof window.testSupabaseConnection === "function") {
    const res = await window.testSupabaseConnection();
    if (res.success) {
      if (topbarBadge) {
        topbarBadge.className = "cloud-status-badge connected";
        topbarBadge.innerHTML = `<span class="status-dot"></span> <span class="status-text">🟢 Supabase Live Cloud Sync</span>`;
      }
      if (mobileDot) {
        mobileDot.style.background = "#10b981";
        mobileDot.title = "Supabase Live Connected";
      }
      if (sidebarWidget) sidebarWidget.className = "sidebar-cloud-btn connected";
      if (sidebarText) {
        sidebarText.textContent = "🟢 Live Connected";
        sidebarText.style.color = "#10b981";
      }
      if (sidebarDot) sidebarDot.style.background = "#10b981";
      if (panelPill) {
        panelPill.className = "cloud-status-pill connected";
        panelPill.textContent = "🟢 Live Connected";
      }
    } else {
      if (topbarBadge) {
        topbarBadge.className = "cloud-status-badge error";
        topbarBadge.innerHTML = `<span class="status-dot"></span> <span class="status-text">🔴 Supabase Config Error</span>`;
      }
      if (mobileDot) {
        mobileDot.style.background = "#ef4444";
        mobileDot.title = "Supabase Connection Error";
      }
      if (sidebarWidget) sidebarWidget.className = "sidebar-cloud-btn error";
      if (sidebarText) {
        sidebarText.textContent = "🔴 Sync Error";
        sidebarText.style.color = "#ef4444";
      }
      if (sidebarDot) sidebarDot.style.background = "#ef4444";
      if (panelPill) {
        panelPill.className = "cloud-status-pill offline";
        panelPill.textContent = "🔴 Connection Error";
      }
    }
  }
};

/**
 * Handle Save Supabase Project URL & Anon Key from Admin UI
 */
window.handleSaveSupabaseConfig = async function(event) {
  event.preventDefault();
  const url = document.getElementById("cfg-supabase-url")?.value.trim();
  const anonKey = document.getElementById("cfg-supabase-key")?.value.trim();
  const msgEl = document.getElementById("supabase-connection-msg");

  if (!url || !anonKey) {
    alert("Please provide both Supabase Project URL and Anon Key.");
    return;
  }

  if (typeof window.saveSupabaseConfig === "function") {
    window.saveSupabaseConfig(url, anonKey);
    showToast("💾 Supabase credentials saved!");

    if (msgEl) {
      msgEl.style.display = "block";
      msgEl.style.color = "var(--accent-cyan)";
      msgEl.innerHTML = "⏳ Testing new Supabase connection...";
    }

    const testRes = await window.testSupabaseConnection();
    if (msgEl) {
      msgEl.style.display = "block";
      msgEl.style.color = testRes.success ? "#10b981" : "#ef4444";
      msgEl.innerHTML = testRes.message;
    }

    await checkSupabaseStatus();

    // Re-initialize live portfolio data from Supabase
    if (window.PortfolioData && typeof window.PortfolioData.init === "function") {
      await window.PortfolioData.init();
      loadDashboardData();
    }
  }
};

/**
 * Handle Manual Test Connection button
 */
window.handleTestSupabaseConnection = async function() {
  const msgEl = document.getElementById("supabase-connection-msg");
  if (msgEl) {
    msgEl.style.display = "block";
    msgEl.style.color = "var(--accent-cyan)";
    msgEl.innerHTML = "⏳ Testing Supabase Cloud connection...";
  }

  if (typeof window.testSupabaseConnection === "function") {
    const res = await window.testSupabaseConnection();
    if (msgEl) {
      msgEl.style.display = "block";
      msgEl.style.color = res.success ? "#10b981" : "#ef4444";
      msgEl.innerHTML = res.message;
    }
    showToast(res.success ? "✅ Supabase connection verified!" : "❌ Supabase connection failed.");
    await checkSupabaseStatus();
  }
};

/**
 * Handle 1-Click Database Seed into Supabase
 */
window.handleSeedSupabase = async function() {
  if (!confirm("Upload current portfolio data (projects, services, profile) into your Supabase database? This will ensure all browsers immediately see your live content.")) {
    return;
  }

  if (typeof window.PortfolioData.seedSupabase === "function") {
    showToast("⏳ Seeding Supabase Cloud database...");
    const res = await window.PortfolioData.seedSupabase();
    if (res.success) {
      showToast("🎉 Supabase Database initialized & seeded successfully! Live across all browsers.");
      await checkSupabaseStatus();
    } else {
      alert("❌ Seeding failed: " + (res.error || res.message) + "\n\nPlease make sure the table 'portfolio_data' exists by running the SQL setup script in Supabase SQL Editor.");
    }
  }
};

/**
 * Copy Complete SQL Schema & Storage Setup Script to Clipboard
 */
window.handleCopySqlSchema = function() {
  const sqlScript = `-- RAMMOHAN MURMU PORTFOLIO - FULL SUPABASE DATABASE & STORAGE SETUP
-- 1. Create portfolio_data table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by TEXT DEFAULT 'admin'
);

ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Read Access" ON public.portfolio_data;
CREATE POLICY "Allow Public Read Access" ON public.portfolio_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Public / Auth Full Access" ON public.portfolio_data;
CREATE POLICY "Allow Public / Auth Full Access" ON public.portfolio_data FOR ALL USING (true) WITH CHECK (true);

-- 2. Enable Realtime Sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_data;

-- 3. Create Public Storage Bucket for Images & Videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-media', 'portfolio-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "portfolio_media_select" ON storage.objects;
CREATE POLICY "portfolio_media_select" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "portfolio_media_insert" ON storage.objects;
CREATE POLICY "portfolio_media_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "portfolio_media_update" ON storage.objects;
CREATE POLICY "portfolio_media_update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-media') WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "portfolio_media_delete" ON storage.objects;
CREATE POLICY "portfolio_media_delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-media');`;

  navigator.clipboard.writeText(sqlScript).then(() => {
    showToast("📋 Full SQL & Storage Bucket Schema copied! Paste in Supabase SQL Editor and click Run.");
  }).catch(() => {
    alert("Could not automatically copy. Please open 'supabase_schema.sql' in your project root and copy all text.");
  });
};

/**
 * Clean / Wipe All Demo Data and Start 100% Fresh
 */
window.handleCleanResetAllData = async function() {
  const confirmed = confirm(
    "⚠️ ARE YOU SURE YOU WANT TO WIPE ALL DEMO DATA?\n\nThis will remove all demo projects, demo services, and dummy reviews from both your browser and your live Supabase Cloud database.\n\nYou will get a completely fresh, empty portfolio ready to upload your own projects.\n\nClick OK to clean everything now."
  );
  if (!confirmed) return;

  showToast("⏳ Cleaning and resetting all data...");
  if (window.PortfolioData && typeof window.PortfolioData.resetToCleanSlate === "function") {
    const res = await window.PortfolioData.resetToCleanSlate();
    if (res && res.success !== false) {
      showToast("🎉 All demo data wiped! Supabase and site are 100% clean & fresh.");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      showToast("⚠️ Reset saved locally: " + (res.error || "Supabase not connected"));
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }
};
window.handleResetData = window.handleCleanResetAllData;

/**
 * Update Admin Password via Supabase Auth
 */
window.handleUpdateAdminPassword = async function(event) {
  event.preventDefault();
  const passInput = document.getElementById("change-admin-password-val");
  const newPass = passInput ? passInput.value : "";

  if (!newPass || newPass.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (typeof window.supabaseUpdatePassword === "function") {
    showToast("⏳ Updating password in Supabase Auth...");
    const res = await window.supabaseUpdatePassword(newPass);
    if (res.success) {
      showToast("🎉 Supabase Admin password updated successfully!");
      if (passInput) passInput.value = "";
    } else {
      alert("❌ Password update failed: " + res.error);
    }
  }
};

/**
 * Toggle password field visibility
 */
window.togglePasswordVisibility = function(inputId, btnEl) {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (el.type === "password") {
    el.type = "text";
    if (btnEl) btnEl.textContent = "🙈";
  } else {
    el.type = "password";
    if (btnEl) btnEl.textContent = "👁️";
  }
};

/* Toast Notification Helper */
function showToast(message) {
  const toast = document.getElementById("admin-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

