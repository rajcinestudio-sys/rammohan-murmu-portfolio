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
    projectsDone: "85+",
    happyClients: "60+",
    clientSatisfaction: "99%",
    avatar: "assets/images/avatar.svg",
    aboutImage: "assets/images/avatar.svg",
    resumeLink: "#contact",
    socials: {
      whatsapp: "https://wa.me/918250550060",
      behance: "https://www.behance.net/",
      dribbble: "https://dribbble.com/",
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
      youtube: "https://www.youtube.com/@rammohanmurmu",
      github: "https://github.com/",
      facebook: "https://www.facebook.com/"
    },
    customSocials: [
      { name: "Twitter / X", url: "https://twitter.com/", icon: "🐦" },
      { name: "Pinterest", url: "https://pinterest.com/", icon: "📌" }
    ]
  },
  socialHub: {
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
  services: [
    {
      id: "srv-1",
      icon: "pen-tool",
      title: "Graphics Designing",
      badge: "Mastery",
      ribbon: "",
      shortDesc: "Crafting premium visual brand identities, advertising creatives, high-conversion YouTube thumbnails, event posters, certificates, and flex banners.",
      images: [
        "assets/images/project_apex_branding.svg",
        "assets/images/project_solaris_poster.svg"
      ],
      features: [
        "Brand Identity & Logos",
        "YouTube Viral Thumbnails",
        "Event Posters & Flyers",
        "Certificates & ID Cards",
        "Flex & Hoarding Banners",
        "Vector Illustrations"
      ],
      tools: [
        { name: "Adobe Photoshop", color: "#31a8ff" },
        { name: "Adobe Illustrator", color: "#ff9a00" },
        { name: "Canva Pro", color: "#00c4cc" }
      ],
      proficiency: 95,
      theme: "gold"
    },
    {
      id: "srv-2",
      icon: "ui-layout",
      title: "UI/UX & Web Design",
      badge: "Advanced",
      ribbon: "",
      shortDesc: "Designing user-centric mobile applications, SaaS dashboards, and modern interactive 3D web interfaces with Figma wireframes and responsive prototypes.",
      images: [
        "assets/images/project_cybervibe_web.svg",
        "assets/images/project_novapay_ui.svg",
        "assets/images/project_gourmet_ui.svg"
      ],
      features: [
        "Figma Mobile App UI/UX",
        "Modern Responsive Web",
        "SaaS Dashboard Interfaces",
        "Wireframing & UX Flow",
        "Design Systems & Tokens"
      ],
      tools: [
        { name: "Figma", color: "#a259ff" },
        { name: "Adobe XD", color: "#ff61f6" },
        { name: "HTML5 / CSS3", color: "#ea580c" }
      ],
      proficiency: 92,
      theme: "cyan"
    },
    {
      id: "srv-3",
      icon: "video-camera",
      title: "Cinematic Video Editing",
      badge: "Specialist",
      ribbon: "",
      shortDesc: "High-retention YouTube video editing, cinematic color grading, teaser trailers, commercial promo ads, TikTok/Reels viral shorts, and custom sound design.",
      images: [
        "assets/images/project_neon_promo.svg",
        "assets/images/project_vlog_editing.svg"
      ],
      features: [
        "High-Retention YouTube Edits",
        "Cinematic Color Grading",
        "Teasers & Trailer Cuts",
        "Commercial & Promo Ads",
        "Viral Reels & Shorts VFX"
      ],
      tools: [
        { name: "Adobe Premiere Pro", color: "#9999ff" },
        { name: "After Effects", color: "#c880ff" },
        { name: "CapCut Pro", color: "#00d2c4" }
      ],
      proficiency: 94,
      theme: "orange"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CyberForge Gaming - Viral YouTube Thumbnails Suite",
      category: "graphics",
      categoryName: "Graphic Design",
      subCategory: "thumbnail",
      subCategoryName: "YouTube Thumbnails",
      featured: true,
      image: "assets/images/project_apex_branding.svg",
      images: ["assets/images/project_apex_branding.svg"],
      client: "CyberForge Studios (850K Subs)",
      duration: "4 Days",
      tools: ["Adobe Photoshop", "Illustrator", "Blender 3D"],
      description: "High-CTR 3D gaming thumbnail package featuring custom 3D lighting, expression cutouts, dynamic glow strokes, and vibrant visual hierarchy that improved click-through rates by 28%.",
      liveLink: "https://behance.net",
      videoUrl: "",
      videoFile: "",
      tags: ["YouTube Thumbnail", "Gaming", "High CTR", "Photoshop", "3D Art"],
      reviews: [
        {
          id: "rev-1",
          userName: "Ankit Verma (CyberForge)",
          rating: 5,
          comment: "Rammohan's thumbnail designs skyrocketed our video CTR from 6.2% to 11.4%! Absolutely phenomenal work.",
          date: "Yesterday"
        }
      ]
    },
    {
      id: "proj-2",
      title: "Apex Esports - Brand Identity & Logo Suite",
      category: "graphics",
      categoryName: "Graphic Design",
      subCategory: "logo",
      subCategoryName: "Logos & Branding",
      featured: true,
      image: "assets/images/project_apex_branding.svg",
      images: ["assets/images/project_apex_branding.svg"],
      client: "Apex Esports League",
      duration: "2 Weeks",
      tools: ["Adobe Illustrator", "Photoshop", "Figma"],
      description: "Complete visual identity design including an aggressive vector mascot logo, brand guidelines manual, typography palette, jersey graphics, and stream overlay assets.",
      liveLink: "https://behance.net",
      videoUrl: "",
      videoFile: "",
      tags: ["Branding", "Vector Logo", "Esports", "Illustrator"],
      reviews: [
        {
          id: "rev-2",
          userName: "Rohit Sharma",
          rating: 5,
          comment: "Transformed our whole gaming organization identity. The vector precision is unbelievable.",
          date: "3 days ago"
        }
      ]
    },
    {
      id: "proj-3",
      title: "Sunburn Music Festival - Grand Event Poster & Flex Banner",
      category: "graphics",
      categoryName: "Graphic Design",
      subCategory: "poster",
      subCategoryName: "Posters & Flyers",
      featured: false,
      image: "assets/images/project_poster_event.svg",
      images: ["assets/images/project_poster_event.svg"],
      client: "Pulse Events Global",
      duration: "5 Days",
      tools: ["Adobe Photoshop", "Illustrator"],
      description: "High-resolution multi-format event promotional campaign including A3 printed posters, highway flex hoardings (20x10 ft), and social media announcement carousels.",
      liveLink: "https://behance.net",
      videoUrl: "",
      videoFile: "",
      tags: ["Event Poster", "Flex Banner", "Print Ready", "Photoshop"],
      reviews: []
    },
    {
      id: "proj-4",
      title: "Global Tech Academy - Premium Certificate & Smart ID Card",
      category: "graphics",
      categoryName: "Graphic Design",
      subCategory: "certificate_id",
      subCategoryName: "Certificates & ID Cards",
      featured: false,
      image: "assets/images/project_apex_branding.svg",
      images: ["assets/images/project_apex_branding.svg"],
      client: "National Institute of Design & Tech",
      duration: "1 Week",
      tools: ["Adobe Illustrator", "InDesign", "Photoshop"],
      description: "Official security-enhanced diploma certificate with guilloche watermark borders and QR verification, paired with modern NFC-ready corporate employee ID cards.",
      liveLink: "https://behance.net",
      videoUrl: "",
      videoFile: "",
      tags: ["Certificate Design", "ID Card", "Corporate Print", "Vector Security"],
      reviews: []
    },
    {
      id: "proj-5",
      title: "HyperX Gear Launch - 4K Cinematic Commercial & Teaser Trailer",
      category: "video",
      categoryName: "Video Editing",
      subCategory: "teaser_trailer",
      subCategoryName: "Teasers & Trailers",
      featured: true,
      image: "assets/images/project_cinematic_showreel.svg",
      images: ["assets/images/project_cinematic_showreel.svg"],
      client: "HyperX Gaming India",
      duration: "10 Days",
      tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"],
      description: "High-octane commercial teaser trailer featuring 3D product motion graphics, dynamic sound design with heavy bass hits, cinematic anamorphic color grading, and VFX glitches.",
      liveLink: "",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoFile: "",
      tags: ["Cinematic Video", "Promo Teaser", "Color Grading", "Sound Design"],
      reviews: [
        {
          id: "rev-3",
          userName: "Sneha Mukherjee",
          rating: 5,
          comment: "The trailer got 300k+ views on launch week! Sound design and pacing were top notch.",
          date: "1 week ago"
        }
      ]
    },
    {
      id: "proj-6",
      title: "Alex Vlogs - High Retention Viral YouTube Editing",
      category: "video",
      categoryName: "Video Editing",
      subCategory: "yt_retention",
      subCategoryName: "YouTube Retention Edits",
      featured: false,
      image: "assets/images/project_vlog_editing.svg",
      images: ["assets/images/project_vlog_editing.svg"],
      client: "Alex Vlogs (1.2M Subs)",
      duration: "Ongoing",
      tools: ["Adobe Premiere Pro", "After Effects", "Photoshop"],
      description: "Fast-paced YouTube editing style with custom sound effects, animated subtitle captions, B-roll transitions, zooms, and custom thumbnails that increased average watch duration by 42%.",
      liveLink: "",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      videoFile: "",
      tags: ["YouTube Video", "High Retention", "Custom Thumbnails", "B-Roll"],
      reviews: []
    },
    {
      id: "proj-7",
      title: "NovaPay - Crypto & Neo-Banking Mobile App UI/UX",
      category: "uiux",
      categoryName: "UI/UX Design",
      subCategory: "mobile_app",
      subCategoryName: "Mobile App UI (Figma)",
      featured: true,
      image: "assets/images/project_novapay_ui.svg",
      images: ["assets/images/project_novapay_ui.svg"],
      client: "Nova Financial Technologies",
      duration: "3 Weeks",
      tools: ["Figma", "Adobe Illustrator", "Protopie"],
      description: "Next-gen fintech mobile app featuring dark/glassmorphic aesthetics, biometric authentication, instant crypto swap interfaces, and fully interactive Figma component design systems.",
      liveLink: "https://figma.com",
      videoUrl: "",
      videoFile: "",
      tags: ["Fintech", "Mobile App UI", "Figma", "Design System"],
      reviews: []
    },
    {
      id: "proj-8",
      title: "Quantum SaaS - 3D Analytics Dashboard & Web Landing Page",
      category: "uiux",
      categoryName: "UI/UX Design",
      subCategory: "web_design",
      subCategoryName: "Modern Web & Landing",
      featured: true,
      image: "assets/images/project_quantum_web.svg",
      images: ["assets/images/project_quantum_web.svg"],
      client: "Quantum Cloud Solutions",
      duration: "2.5 Weeks",
      tools: ["HTML5", "CSS3", "JavaScript", "Figma"],
      description: "Futuristic dark-mode landing page and analytics dashboard with interactive 3D particle canvas background, real-time KPI graphs, and smooth scroll animations.",
      liveLink: "https://github.com",
      videoUrl: "",
      videoFile: "",
      tags: ["3D Web", "Landing Page", "SaaS Dashboard", "Interactive"],
      reviews: []
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Rohit Sharma",
      role: "Founder, Apex Gaming League",
      comment: "Rammohan's graphic design and branding transformed our esports team's identity. Our Twitch overlays and tournament banners look world-class! Highly recommended.",
      rating: 5,
      avatar: "assets/images/avatar.svg"
    },
    {
      id: "test-2",
      name: "Sneha Mukherjee",
      role: "Marketing Lead, Pulse Events",
      comment: "The video teaser and Instagram reels edited by Rammohan generated over 250,000 views in just 48 hours. His sound design and color grading are top-notch.",
      rating: 5,
      avatar: "assets/images/avatar.svg"
    },
    {
      id: "test-3",
      name: "Vikram Das",
      role: "CEO, Nova Financial Tech",
      comment: "The UI/UX design for our mobile banking app was delivered with great attention to detail. Figma interactive prototypes and design system helped our developers ship faster.",
      rating: 5,
      avatar: "assets/images/avatar.svg"
    }
  ]
};

const STORAGE_KEY = "rammohan_murmu_portfolio_data_v4";

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
          profile: { 
            ...DEFAULT_PORTFOLIO_DATA.profile, 
            ...(parsed.profile || {}),
            customSocials: (parsed.profile && parsed.profile.customSocials) || DEFAULT_PORTFOLIO_DATA.profile.customSocials
          },
          socialHub: {
            ...DEFAULT_PORTFOLIO_DATA.socialHub,
            ...(parsed.socialHub || {})
          },
          services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : DEFAULT_PORTFOLIO_DATA.services,
          projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : DEFAULT_PORTFOLIO_DATA.skills
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

  // 6. Security PIN
  updatePin(newPin) {
    const data = this.get();
    data.adminPin = newPin;
    this.save(data);
    return true;
  },

  // 7. Backup & Export
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

