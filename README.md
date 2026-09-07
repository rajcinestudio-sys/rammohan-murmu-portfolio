# 🚀 Modern 3D Portfolio & Realtime Admin CMS (v4.0)

A state-of-the-art, 3D-animated, ultra-responsive portfolio website and full-featured **Realtime Admin CMS Dashboard** powered by **HTML5, Vanilla CSS3, JavaScript (ES6+)**, and **Supabase Cloud Database & Auth**.

---

## 🤖 AI Master Prompt File (`MASTER_PROMPT.md`)

This repository includes a standalone, feature-complete master prompt file: **[`MASTER_PROMPT.md`](MASTER_PROMPT.md)**.

### How to Use the Master Prompt:
1. Open [`MASTER_PROMPT.md`](MASTER_PROMPT.md).
2. At the top of the file, fill in your personal portfolio information under **`1. PORTFOLIO DATA CONFIGURATION`** (Name, roles, bio, contact details, social links, services, projects, Supabase credentials).
3. Copy and paste the entire prompt into any AI agent or IDE (Gemini, Claude, ChatGPT, Cursor, Antigravity, etc.).
4. The AI agent will automatically design and build a 100% custom, breathtaking visual portfolio with all the same architectural capabilities, touch sliders, multi-media lightbox modals, and realtime CMS synchronization!

---

## 🌟 Key Architecture & Features

### 1. 💫 Dynamic Preloader / Splash Screen
- Sleek dark glassmorphic loading screen featuring a dynamic profile avatar or initials logo badge.
- Real-time animated **`0%` to `100%`** progress counter and neon glowing progress bar that smoothly unlocks page scroll upon completion.

### 2. ⚡ Dynamic Hero 16:9 Featured Works Auto-Slider
- **Desktop & Mobile 16:9 Showcase**: Auto-advances every 4.5 seconds with pause-on-hover.
- **Touch-Swipe & Mouse-Drag Gestures**: Seamless horizontal swiping support on mobile devices and draggable slide navigation on desktop.
- **CMS Control**: Check or uncheck **"⭐ Feature in Hero Slider"** in the Admin Dashboard to dynamically update the carousel.
- **Direct Modal Lightbox Trigger**: Clicking any slide immediately opens the project in full detail.

### 3. 🖼️ Multi-Media Project Lightbox Modal
- **High-Contrast Visible Close Button ("X")**:
  - Positioned at the top right of the modal with `z-index: 1000`.
  - Solid dark frosted circular glass backdrop with crisp white SVG icon.
  - Interactive hover state glowing red with smooth rotation.
  - Dismissible via button click, background backdrop tap, or keyboard **`Escape`** key.
- **Multi-Media Playback**:
  - Multi-image showcase with horizontal click-to-switch thumbnail gallery.
  - HTML5 video player for `.mp4`/`.webm` media.
  - YouTube video player with automatic embed URL conversion (`youtu.be` & `watch?v=`).
- **Interactive Reviews & 5-Star Ratings**:
  - Displays dynamic average star rating and review count.
  - Real-time review submission form allowing visitors to leave a 1-5 star rating and comment.

### 4. 🗂️ Multi-Tier Category & Subcategory Filtering
- Filter works seamlessly across main domains:
  - **Graphic Design & Branding** (`YouTube Thumbnails`, `Posters & Flyers`, `Logos & Branding`, `Flex & Hoardings`, etc.)
  - **Cinematic Video Editing** (`Cinematic Edits`, `Retention Edits`, `Teasers & Trailers`, `Reels & Shorts`)
  - **UI/UX & Web Design** (`Mobile Apps (Figma)`, `Modern Web & Landing`, `Dashboards`)
- Subcategory chip pills dynamically adjust according to the active main category.

### 5. ⚡ Full Services Manager with 16:9 Showcase Sliders
- Service cards with animated tag badges, tools used, and description.
- Built-in 16:9 auto-sliding showcase banner box displaying sample works of that service.
- Full touch-swipe support on service banner sliders.

### 6. 💬 WhatsApp Smart Automation Bot
- Pre-configured WhatsApp booking modal for fast client inquiries.
- Automatically formats client project requirements, budget, and contact info into a direct WhatsApp message.

### 7. ☁️ Supabase Cloud Database & Realtime Synchronization
- **Live Cloud Sync**: Seamlessly syncs with Supabase PostgreSQL database (`portfolio_data` table).
- **Realtime Changes**: Any update made in the Admin CMS instantly updates the public portfolio across all open tabs and devices without needing a page refresh.
- **Offline Resilient**: Automatically caches data to browser `localStorage` and falls back to `data.json` if offline.

### 8. 🔒 Secure Admin CMS Dashboard (`admin.html`)
- **Authentication**: Supabase Email/Password login, official Supabase password recovery email workflow, plus fallback 4-digit PIN access (default: `1234`).
- **Clean Main Topbar**: Uncluttered header focused strictly on current tab title and quick actions.
- **3-Line Menu Cloud Sync Widget**: The slide-out hamburger sidebar features an integrated Cloud Sync status button (`🟢 Live Connected`, `🟡 Offline Mode`, `🔴 Sync Error`) that navigates directly to cloud settings.
- **Modules**:
  1. **Overview**: Metric counters for projects, services, reviews, and cloud media files.
  2. **Project Manager**: Add, edit, and delete projects with multi-image gallery uploads, video URLs, and subcategory tags.
  3. **Services Manager**: Manage service offerings and banner preview carousels.
  4. **Profile & Social Hub**: Update bio, avatar, phone, WhatsApp, and social media handles.
  5. **Skills & Tools Manager**: Configure skill pills and mastery levels.
  6. **Reviews Moderation**: Approve or delete visitor reviews.
  7. **Supabase & Backup Sync**: Configure cloud credentials, test live connection, seed live database from JSON, export full `data.json` backup, and wipe demo data.
  8. **Theme Studio**: Switch visual color themes and accents.

---

## 🚀 How to Host on GitHub Pages (100% Free)

This project requires zero build tools or Node.js runtimes. It runs directly on any static web host:

1. Create a repository on [GitHub](https://github.com/).
2. Push or upload the project files:
   - `index.html` (Main portfolio)
   - `admin.html` (Admin CMS)
   - `MASTER_PROMPT.md` (AI master prompt)
   - `supabase_schema.sql` (Database schema)
   - `data.json` (Default dataset)
   - `css/` (`style.css`, `admin.css`)
   - `js/` (`data.js`, `main.js`, `admin.js`, `supabase-config.js`)
   - `assets/` (Images and icons)
3. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment**, set Source to **Deploy from a branch**.
   - Select Branch: `main` (or `master`) and directory: `/ (root)`.
   - Click **Save**.
4. Your site will be live at `https://<your-username>.github.io/<repository-name>/`!

---

## ⚡ Connecting to Supabase Cloud

1. Create a free project at [supabase.com](https://supabase.com/).
2. In your Supabase Dashboard, go to **SQL Editor** → Click **New query**.
3. Copy the contents of [`supabase_schema.sql`](supabase_schema.sql) and paste it into the editor, then click **Run**.
4. In Supabase, go to **Project Settings** → **API** to find your:
   - **Project URL**
   - **Anon Public API Key**
5. Open [`admin.html`](admin.html) → Go to **Supabase & Sync** tab → Paste your Project URL & Anon Key → Click **Save & Connect**.
6. Click **Seed Live Supabase Database from JSON** to initialize your cloud database with your starter content.

---

## 📞 Configured Contact Details

- **Name**: Rammohan Murmu
- **Role**: Creative Graphic & Web Designer | Video Editor
- **WhatsApp**: +91 8250550060
- **Phone**: +91 8250550062
- **Email**: rammohanmurmu0@gmail.com
- **Location**: West Bengal, India • Remote Worldwide

---
*Powered by Pure HTML5, CSS3, ES6+ JavaScript, Supabase Cloud & Realtime Architecture.*
