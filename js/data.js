/**
 * Portfolio Data Engine & LocalStorage Manager (v3.0)
 * Rammohan Murmu Portfolio CMS
 */

const PORTFOLIO_CATEGORIES = {
  graphics: {
    id: "graphics",
    name: "Graphic Design & Branding",
    icon: "🎨",
    subCategories: [
      { id: "all", name: "🌟 All Graphics" },
      { id: "thumbnail", name: "📺 YouTube Thumbnails" },
      { id: "poster", name: "🖼️ Posters & Flyers" },
      { id: "logo", name: "✨ Logos & Branding" },
      { id: "flex_banner", name: "📐 Flex & Hoardings" },
      { id: "certificate_id", name: "🎖️ Certificates & ID Cards" },
      { id: "social_media", name: "📱 Social Media Creatives" },
      { id: "vector_art", name: "✏️ Vector Art & Illustrations" }
    ]
  },
  video: {
    id: "video",
    name: "Cinematic Video Editing",
    icon: "🎬",
    subCategories: [
      { id: "all", name: "🌟 All Videos" },
      { id: "cinematic", name: "🎥 Cinematic Edits" },
      { id: "yt_retention", name: "⚡ YouTube Retention Edits" },
      { id: "teaser_trailer", name: "🎞️ Teasers & Trailers" },
      { id: "promo_commercial", name: "📢 Promo & Commercials" },
      { id: "reels_shorts", name: "📱 Reels & Shorts" },
      { id: "vfx_intro", name: "✨ VFX & Intros" }
    ]
  },
  uiux: {
    id: "uiux",
    name: "UI/UX & Web Design",
    icon: "💻",
    subCategories: [
      { id: "all", name: "🌟 All UI/UX & Web" },
      { id: "mobile_app", name: "📱 Mobile App UI (Figma)" },
      { id: "web_design", name: "🌐 Modern Web & Landing" },
      { id: "saas_dashboard", name: "📊 SaaS Dashboards" },
      { id: "wireframe", name: "📐 Wireframing & UX Flow" }
    ]
  }
};

const DEFAULT_PORTFOLIO_DATA = {
  activeTheme: "cyber-dark",
  profile: {
    name: "Rammohan Murmu",
    title: "Creative Graphics & Web Designer | Video Editor",
    tagline: "Transforming ideas into high-impact visuals, modern 3D web experiences & cinematic videos.",
    shortBio: "Specializing in High-End Branding, UI/UX Design, Modern Web Development, and Viral Video Editing with over 3+ years of experience.",
    fullBio: "Hello! I am Rammohan Murmu, a passionate multidisciplinary designer and creative video editor based in India. I craft distinctive visual identities, intuitive user experiences, responsive modern websites, and engaging motion content. My mission is to elevate brands and creators through cutting-edge 3D aesthetics, bold typography, seamless animations, and strategic design.",
    phone: "8250550062",
    displayPhone: "+91 8250550062",
    whatsapp: "8250550060",
    displayWhatsapp: "+91 8250550060",
    email: "rammohanmurmu0@gmail.com",
    location: "West Bengal, India",
    availability: "Available for Freelance & Full-time",
    yearsExp: "3+",
    projectsDone: "50+",
    happyClients: "40+",
    clientSatisfaction: "99%",
    avatar: "",
    aboutImage: "",
    resumeLink: "#contact",
    socials: {
      youtube: "https://www.youtube.com/@rammohanmurmu",
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/",
      whatsapp: "https://wa.me/918250550060"
    },
    customSocials: []
  },
  socialHub: {
    showYouTubeHub: true,
    youtubeTitle: "Rammohan Murmu - Creative Studio",
    youtubeHandle: "@rammohanmurmu_design",
    youtubeUrl: "https://www.youtube.com/@rammohanmurmu",
    subscribersCount: "15.4K+",
    featuredVideoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    featuredVideoTitle: "Showreel 2026: 3D Branding & Cinematic Motion Editing",
    instagramHandle: "@rammohan_creates",
    instagramUrl: "https://www.instagram.com/",
    behanceUrl: "https://www.behance.net/",
    dribbbleUrl: "https://dribbble.com/",
    telegramUrl: "https://t.me/rammohanmurmu",
    whatsappUrl: "https://wa.me/918250550060"
  },
  adminPin: "1234",
  services: [],
  projects: [],
  skills: [
    { name: "Adobe Photoshop", level: 95, category: "graphics", icon: "ps" },
    { name: "Adobe Illustrator", level: 90, category: "graphics", icon: "ai" },
    { name: "Premiere Pro & After Effects", level: 92, category: "video", icon: "pr" },
    { name: "Figma & UI/UX Design", level: 88, category: "uiux", icon: "figma" },
    { name: "HTML5, CSS3 & JavaScript", level: 85, category: "web", icon: "code" }
  ],
  testimonials: []
};

const STORAGE_KEY = "rammohan_murmu_portfolio_data_v4";

// ==========================================================================
// UNIVERSAL YOUTUBE PARSER & EMBED ENGINE
// Handles all YouTube formats: watch, youtu.be, shorts, live, embed, iframe, etc.
// ==========================================================================
window.YouTubeHelper = {
  extractVideoId(input) {
    if (!input || typeof input !== "string") return null;
    let str = input.trim();

    // 1. If raw <iframe> code was pasted, extract src
    if (str.includes("<iframe") && str.includes("src=")) {
      const srcMatch = str.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        str = srcMatch[1].trim();
      }
    }

    // 2. Direct 11-char video ID check (alphanumeric, -, _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
      return str;
    }

    // 3. Primary regex matching all standard YouTube URLs:
    // - youtube.com/watch?v=ID or youtube.com/watch?...&v=ID
    // - youtu.be/ID
    // - youtube.com/embed/ID
    // - youtube.com/shorts/ID
    // - youtube.com/live/ID
    // - youtube.com/v/ID
    // - m.youtube.com/...
    // - youtube-nocookie.com/...
    const regExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?(?:.*&)?v=))([a-zA-Z0-9_-]{11})/i;
    const match = str.match(regExp);
    if (match && match[1]) {
      return match[1];
    }

    // 4. Secondary fallback: query param ?v= or &v= anywhere in string
    const vParamMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (vParamMatch && vParamMatch[1]) {
      return vParamMatch[1];
    }

    return null;
  },

  getEmbedUrl(input, options = {}) {
    const videoId = this.extractVideoId(input);
    if (!videoId) return null;

    const autoplay = options.autoplay ? "1" : "0";
    const mute = options.mute ? "1" : "0";
    const controls = options.controls === false ? "0" : "1";
    const loop = options.loop ? `1&playlist=${videoId}` : "0";

    // Safe origin calculation to prevent YouTube Error 153 (Video player configuration error)
    let originParam = "";
    try {
      if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file:")) {
        originParam = `&origin=${encodeURIComponent(window.location.origin)}`;
      }
    } catch (e) {}

    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&controls=${controls}&loop=${loop}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${originParam}`;
  },

  getThumbnailUrl(input, quality = "hqdefault") {
    const videoId = this.extractVideoId(input);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  },

  createIframeHtml(input, title = "YouTube Video", options = {}) {
    const embedUrl = this.getEmbedUrl(input, options);
    if (!embedUrl) return "";

    const escapedTitle = (title || "YouTube Video").replace(/"/g, '&quot;');
    return `<iframe 
      src="${embedUrl}" 
      title="${escapedTitle}" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin" 
      allowfullscreen 
      style="width: 100%; height: 100%; border: none; display: block;">
    </iframe>`;
  }
};

// Central Data Store Interface
window.PortfolioData = {
  _isInitialized: false,
  _isSyncing: false,

  getCategories() {
    return PORTFOLIO_CATEGORIES;
  },

  getDefaultData() {
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  },

  get() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("rammohan_murmu_portfolio_data_v3");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PORTFOLIO_DATA,
          ...parsed,
          activeTheme: parsed.activeTheme || DEFAULT_PORTFOLIO_DATA.activeTheme || "cyber-dark",
          profile: { 
            ...DEFAULT_PORTFOLIO_DATA.profile, 
            ...(parsed.profile || {}),
            socials: (parsed.profile && parsed.profile.socials !== undefined) ? parsed.profile.socials : DEFAULT_PORTFOLIO_DATA.profile.socials,
            customSocials: (parsed.profile && Array.isArray(parsed.profile.customSocials)) ? parsed.profile.customSocials : DEFAULT_PORTFOLIO_DATA.profile.customSocials
          },
          socialHub: {
            ...DEFAULT_PORTFOLIO_DATA.socialHub,
            ...(parsed.socialHub || {})
          },
          services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_PORTFOLIO_DATA.services,
          projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
          skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_PORTFOLIO_DATA.skills,
          testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : (parsed.testimonials !== undefined ? [] : (DEFAULT_PORTFOLIO_DATA.testimonials || []))
        };
      }
    } catch (e) {
      console.warn("Could not parse stored portfolio data. Using defaults.", e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  },

  /**
   * Initialize Supabase live data connection & Realtime listener
   */
  async init() {
    if (this._isInitialized) return this.get();
    this._isInitialized = true;

    // Check if Supabase client is available & configured
    if (typeof window.initSupabaseClient === "function") {
      window.initSupabaseClient();
    }

    if (typeof window.isSupabaseConfigured === "function" && window.isSupabaseConfigured()) {
      console.log("[PortfolioData] Connecting to Supabase Cloud Database...");
      try {
        const cloudData = await window.fetchSupabasePortfolioData();
        if (cloudData && typeof cloudData === "object" && (cloudData.profile || cloudData.projects)) {
          console.log("✅ [PortfolioData] Live portfolio data loaded from Supabase Cloud.");
          this.saveLocalOnly(cloudData);
          window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: cloudData }));
        } else {
          console.log("ℹ️ [PortfolioData] Supabase table empty. Auto-seeding initial data...");
          await this.seedSupabase();
        }

        // Setup Realtime Live Channel
        if (typeof window.subscribeSupabaseRealtime === "function") {
          window.subscribeSupabaseRealtime((liveCloudData) => {
            console.log("⚡ [PortfolioData] Realtime update received from Supabase Cloud!");
            this.saveLocalOnly(liveCloudData);
            window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: liveCloudData }));
          });
        }
      } catch (err) {
        console.warn("[PortfolioData] Could not fetch from Supabase:", err);
      }
    }

    return this.get();
  },

  saveLocalOnly(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      return false;
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: data }));
      
      // Async sync to Supabase Cloud
      if (typeof window.saveSupabasePortfolioData === "function" && typeof window.isSupabaseConfigured === "function" && window.isSupabaseConfigured()) {
        this._isSyncing = true;
        window.saveSupabasePortfolioData(data).then((res) => {
          this._isSyncing = false;
          if (res && res.success) {
            console.log("☁️ [PortfolioData] Synced to Supabase Cloud live database.");
          }
        }).catch(err => {
          this._isSyncing = false;
          console.warn("Could not save to Supabase:", err);
        });
      }
      return true;
    } catch (e) {
      console.error("Failed to save data:", e);
      return false;
    }
  },

  async saveAsync(data) {
    this.saveLocalOnly(data);
    window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: data }));

    if (typeof window.saveSupabasePortfolioData === "function" && typeof window.isSupabaseConfigured === "function" && window.isSupabaseConfigured()) {
      return await window.saveSupabasePortfolioData(data);
    }
    return { success: true, localOnly: true };
  },

  async seedSupabase() {
    if (typeof window.supabaseSeedData === "function" && typeof window.isSupabaseConfigured === "function" && window.isSupabaseConfigured()) {
      const current = this.get();
      return await window.supabaseSeedData(current);
    }
    return { success: false, message: "Supabase not configured." };
  },

  async resetToCleanSlate() {
    const cleanData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    this.saveLocalOnly(cleanData);
    window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: cleanData }));

    if (typeof window.supabaseResetAllData === "function" && typeof window.isSupabaseConfigured === "function" && window.isSupabaseConfigured()) {
      return await window.supabaseResetAllData(cleanData);
    }
    return { success: true, localOnly: true };
  },

  // 1. Projects CRUD
  getProjects() {
    return this.get().projects;
  },

  getProjectById(id) {
    return this.get().projects.find(p => p.id === id) || null;
  },

  addProject(project) {
    const data = this.get();
    const newId = "proj-" + Date.now();
    const newProject = {
      id: newId,
      title: project.title || "Untitled Project",
      category: project.category || "graphics",
      categoryName: project.categoryName || (project.category === "graphics" ? "Graphic Design" : (project.category === "video" ? "Video Editing" : "UI/UX & Web")),
      subCategory: project.subCategory || "all",
      subCategoryName: project.subCategoryName || "Custom",
      featured: Boolean(project.featured),
      image: project.image || (project.images && project.images[0]) || "assets/images/project_placeholder.svg",
      images: Array.isArray(project.images) && project.images.length > 0 ? project.images : [project.image || "assets/images/project_placeholder.svg"],
      client: project.client || "Client / Studio",
      duration: project.duration || "1 Week",
      tools: Array.isArray(project.tools) ? project.tools : (project.tools ? project.tools.split(",").map(t => t.trim()) : ["Photoshop"]),
      description: project.description || "Project overview description...",
      liveLink: project.liveLink || "",
      videoUrl: project.videoUrl || "",
      videoFile: project.videoFile || "",
      tags: Array.isArray(project.tags) ? project.tags : (project.tags ? project.tags.split(",").map(t => t.trim()) : ["Design"]),
      reviews: []
    };
    data.projects.unshift(newProject);
    this.save(data);
    return newProject;
  },

  updateProject(id, updates) {
    const data = this.get();
    const index = data.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      const existing = data.projects[index];
      data.projects[index] = {
        ...existing,
        ...updates,
        tools: Array.isArray(updates.tools) ? updates.tools : (typeof updates.tools === "string" ? updates.tools.split(",").map(t => t.trim()) : existing.tools),
        tags: Array.isArray(updates.tags) ? updates.tags : (typeof updates.tags === "string" ? updates.tags.split(",").map(t => t.trim()) : existing.tags),
        images: Array.isArray(updates.images) ? updates.images : existing.images,
        image: updates.image || (updates.images && updates.images[0]) || existing.image
      };
      this.save(data);
      return data.projects[index];
    }
    return null;
  },

  deleteProject(id) {
    const data = this.get();
    data.projects = data.projects.filter(p => p.id !== id);
    this.save(data);
    return true;
  },

  // 2. Services CRUD
  getServices() {
    return this.get().services;
  },

  getServiceById(id) {
    return this.get().services.find(s => s.id === id) || null;
  },

  addService(service) {
    const data = this.get();
    const newId = "srv-" + Date.now();
    const newService = {
      id: newId,
      icon: service.icon || "pen-tool",
      title: service.title || "New Service",
      badge: service.badge || "Specialist",
      ribbon: service.ribbon || "",
      shortDesc: service.shortDesc || "Description of service...",
      images: Array.isArray(service.images) && service.images.length > 0 
        ? service.images 
        : (service.image ? [service.image] : ["assets/images/project_apex_branding.svg"]),
      image: service.image || (service.images && service.images[0]) || "assets/images/project_apex_branding.svg",
      features: Array.isArray(service.features) ? service.features : [],
      tools: Array.isArray(service.tools) ? service.tools : [],
      proficiency: service.proficiency || 90,
      theme: service.theme || "gold"
    };
    data.services.push(newService);
    this.save(data);
    return newService;
  },

  updateService(id, updates) {
    const data = this.get();
    const index = data.services.findIndex(s => s.id === id);
    if (index !== -1) {
      data.services[index] = {
        ...data.services[index],
        ...updates
      };
      this.save(data);
      return data.services[index];
    }
    return null;
  },

  deleteService(id) {
    const data = this.get();
    data.services = data.services.filter(s => s.id !== id);
    this.save(data);
    return true;
  },

  // 3. Project Reviews CRUD
  addProjectReview(projectId, review) {
    const data = this.get();
    const project = data.projects.find(p => p.id === projectId);
    if (!project) return null;

    if (!Array.isArray(project.reviews)) project.reviews = [];
    const newRev = {
      id: "rev-" + Date.now(),
      userName: review.userName || "Visitor",
      rating: parseInt(review.rating) || 5,
      comment: review.comment || "Great work!",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    project.reviews.unshift(newRev);
    this.save(data);
    return newRev;
  },

  deleteProjectReview(projectId, reviewId) {
    const data = this.get();
    const project = data.projects.find(p => p.id === projectId);
    if (!project || !Array.isArray(project.reviews)) return false;

    project.reviews = project.reviews.filter(r => r.id !== reviewId);
    this.save(data);
    return true;
  },

  // 4. Profile & Social Hub
  updateProfile(profileUpdates) {
    const data = this.get();
    data.profile = {
      ...data.profile,
      ...profileUpdates
    };
    this.save(data);
    return data.profile;
  },

  updateSocialHub(socialHubUpdates) {
    const data = this.get();
    data.socialHub = {
      ...data.socialHub,
      ...socialHubUpdates
    };
    this.save(data);
    return data.socialHub;
  },

  // 5. Skills CRUD
  getSkills() {
    return this.get().skills || [
      { name: "Adobe Photoshop", level: 95, category: "graphics", icon: "ps" },
      { name: "Adobe Illustrator", level: 92, category: "graphics", icon: "ai" },
      { name: "Figma (UI/UX)", level: 90, category: "uiux", icon: "figma" },
      { name: "Adobe Premiere Pro", level: 94, category: "video", icon: "pr" },
      { name: "Adobe After Effects", level: 88, category: "video", icon: "ae" },
      { name: "HTML5 / Modern CSS", level: 86, category: "web", icon: "code" }
    ];
  },

  addSkill(skill) {
    const data = this.get();
    if (!data.skills) data.skills = this.getSkills();
    data.skills.push(skill);
    this.save(data);
    return skill;
  },

  updateSkill(index, updates) {
    const data = this.get();
    if (!data.skills) data.skills = this.getSkills();
    if (data.skills[index]) {
      data.skills[index] = { ...data.skills[index], ...updates };
      this.save(data);
      return data.skills[index];
    }
    return null;
  },

  deleteSkill(skillName) {
    const data = this.get();
    if (!data.skills) data.skills = this.getSkills();
    data.skills = data.skills.filter(s => s.name !== skillName);
    this.save(data);
    return true;
  },

  // 6. Testimonials & Client Reviews
  getTestimonials() {
    return this.get().testimonials || [];
  },

  addTestimonial(testimonial) {
    const data = this.get();
    if (!Array.isArray(data.testimonials)) data.testimonials = [];
    testimonial.id = testimonial.id || `test-${Date.now()}`;
    data.testimonials.push(testimonial);
    this.save(data);
    return testimonial;
  },

  deleteTestimonial(id) {
    const data = this.get();
    if (Array.isArray(data.testimonials)) {
      data.testimonials = data.testimonials.filter(t => t.id !== id);
    }
    this.save(data);
    return true;
  },

  deleteProjectReview(projectId, reviewId) {
    const data = this.get();
    if (Array.isArray(data.projects)) {
      const proj = data.projects.find(p => p.id === projectId);
      if (proj && Array.isArray(proj.reviews)) {
        proj.reviews = proj.reviews.filter(r => r.id !== reviewId);
      }
    }
    if (Array.isArray(data.testimonials)) {
      data.testimonials = data.testimonials.filter(t => t.id !== reviewId);
    }
    this.save(data);
    return true;
  },

  // 7. 3D Theme System
  getActiveTheme() {
    return this.get().activeTheme || "cyber-dark";
  },

  updateActiveTheme(themeId) {
    const data = this.get();
    data.activeTheme = themeId;
    this.save(data);
    return data.activeTheme;
  },

  // 7. Security PIN
  updatePin(newPin) {
    const data = this.get();
    data.adminPin = newPin;
    this.save(data);
    return true;
  },

  // 8. Backup & Export
  exportJSON() {
    const data = this.get();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rammohan_murmu_portfolio_data_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && (parsed.profile || parsed.projects)) {
        this.save(parsed);
        return { success: true };
      }
      return { success: false, error: "Invalid portfolio JSON format" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_PORTFOLIO_DATA;
  }
};

// Trigger async initialization on file load
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.PortfolioData && typeof window.PortfolioData.init === "function") {
      window.PortfolioData.init();
    }
  });
}

