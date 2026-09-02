/**
 * ==============================================================================
 * SUPABASE CLOUD DATABASE & AUTH CONNECTOR (v4.0)
 * Rammohan Murmu Portfolio CMS
 * ==============================================================================
 * This module connects your portfolio website directly to Supabase PostgreSQL,
 * Supabase Auth (Email/Password & Password Reset), Realtime Live Sync, and Storage.
 */

// Global configuration object (You can put your credentials directly here OR enter them in Admin CMS Settings)
window.SUPABASE_CONFIG = {
  // Replace these with your Supabase project credentials (from Project Settings -> API)
  url: "https://oyzvvlafbxxltaklphca.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95enZ2bGFmYnh4bHRha2xwaGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MzQyNDUsImV4cCI6MjEwMzIxMDI0NX0.ABgA6RpY7QOHYKd6MoLLMWQrXks-6mr4ob6-20IzZtU",
  storageBucket: "portfolio-media",
  tableName: "portfolio_data",
  recordId: "main"
};

const SUPABASE_LOCAL_STORAGE_KEY = "rm_supabase_credentials_v4";
let _supabaseClientInstance = null;
let _realtimeChannelInstance = null;

/**
 * Get active Supabase configuration (merging file constants and localStorage override)
 */
window.getSupabaseConfig = function() {
  try {
    const saved = localStorage.getItem(SUPABASE_LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          ...window.SUPABASE_CONFIG,
          ...parsed
        };
      }
    }
  } catch (e) {
    console.warn("[Supabase] Failed to read config from localStorage:", e);
  }
  return window.SUPABASE_CONFIG;
};

/**
 * Save new Supabase credentials to localStorage
 */
window.saveSupabaseConfig = function(url, anonKey) {
  const cleanUrl = (url || "").trim().replace(/\/+$/, "");
  const cleanKey = (anonKey || "").trim();

  const cfg = {
    url: cleanUrl,
    anonKey: cleanKey
  };
  localStorage.setItem(SUPABASE_LOCAL_STORAGE_KEY, JSON.stringify(cfg));
  window.SUPABASE_CONFIG.url = cleanUrl;
  window.SUPABASE_CONFIG.anonKey = cleanKey;
  _supabaseClientInstance = null; // force re-instantiation
  return initSupabaseClient();
};

/**
 * Check if valid Supabase configuration is present
 */
window.isSupabaseConfigured = function() {
  const cfg = getSupabaseConfig();
  return Boolean(
    cfg &&
    cfg.url &&
    cfg.url.startsWith("http") &&
    !cfg.url.includes("abcdefghijklmnopqrst") &&
    cfg.anonKey &&
    cfg.anonKey.length > 20 &&
    !cfg.anonKey.includes("example")
  );
};

/**
 * Initialize and get Supabase Client singleton
 */
window.initSupabaseClient = function() {
  if (typeof supabase === "undefined") {
    console.warn("[Supabase] Supabase JS SDK is not loaded yet.");
    return null;
  }

  const cfg = getSupabaseConfig();
  if (!window.isSupabaseConfigured()) {
    return null;
  }

  try {
    if (!_supabaseClientInstance) {
      _supabaseClientInstance = supabase.createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log("[Supabase] Client initialized successfully with URL:", cfg.url);
    }
    return _supabaseClientInstance;
  } catch (err) {
    console.error("[Supabase] Error creating Supabase client:", err);
    return null;
  }
};

window.getSupabaseClient = function() {
  if (!_supabaseClientInstance) {
    return window.initSupabaseClient();
  }
  return _supabaseClientInstance;
};

/**
 * Test Connection with Supabase Database
 */
window.testSupabaseConnection = async function() {
  const client = window.getSupabaseClient();
  if (!client) {
    return { 
      success: false, 
      message: "Supabase credentials are missing or invalid. Please check your Project URL and Anon Key." 
    };
  }

  try {
    const cfg = getSupabaseConfig();
    const { data, error, status } = await client
      .from(cfg.tableName)
      .select("id, updated_at")
      .limit(1);

    if (error) {
      // If table doesn't exist yet
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return {
          success: false,
          needsSchema: true,
          message: `Connected to Supabase project, but table '${cfg.tableName}' does not exist yet. Please run the SQL schema in Supabase SQL Editor.`
        };
      }
      return { success: false, message: `Database error (${error.code}): ${error.message}` };
    }

    const rowExists = Array.isArray(data) && data.length > 0;
    return {
      success: true,
      rowExists: rowExists,
      status: status,
      message: rowExists 
        ? "✅ Connected to Supabase Cloud Database! Live portfolio data is synced."
        : "✅ Connected to Supabase! The database is currently empty. Click 'Initialize & Seed Database' to upload initial data."
    };
  } catch (err) {
    return { success: false, message: "Network error connecting to Supabase: " + err.message };
  }
};

/**
 * Fetch portfolio data from Supabase Cloud
 */
window.fetchSupabasePortfolioData = async function() {
  const client = window.getSupabaseClient();
  if (!client) return null;

  const cfg = getSupabaseConfig();
  try {
    const { data, error } = await client
      .from(cfg.tableName)
      .select("data, updated_at")
      .eq("id", cfg.recordId)
      .single();

    if (error) {
      console.warn("[Supabase] fetch error:", error.message);
      return null;
    }

    if (data && data.data) {
      return data.data;
    }
    return null;
  } catch (e) {
    console.error("[Supabase] Exception fetching data:", e);
    return null;
  }
};

/**
 * Save portfolio data to Supabase Cloud
 */
window.saveSupabasePortfolioData = async function(portfolioData) {
  const client = window.getSupabaseClient();
  if (!client) return { success: false, fallback: true, error: "Supabase not configured" };

  const cfg = getSupabaseConfig();
  try {
    const currentUser = (await client.auth.getUser())?.data?.user;
    const userEmail = currentUser ? currentUser.email : "admin";

    const payload = {
      id: cfg.recordId,
      data: portfolioData,
      updated_at: new Date().toISOString(),
      updated_by: userEmail
    };

    const { data, error } = await client
      .from(cfg.tableName)
      .upsert(payload, { onConflict: "id" })
      .select();

    if (error) {
      console.error("[Supabase] Save error:", error);
      return { success: false, error: error.message };
    }

    console.log("[Supabase] Data saved to Supabase cloud successfully.");
    return { success: true, data };
  } catch (e) {
    console.error("[Supabase] Exception saving data:", e);
    return { success: false, error: e.message };
  }
};

/**
 * Seed initial database row into Supabase
 */
window.supabaseSeedData = async function(defaultData) {
  const client = window.getSupabaseClient();
  if (!client) return { success: false, error: "Supabase not configured" };

  const cfg = getSupabaseConfig();
  try {
    const payload = {
      id: cfg.recordId,
      data: defaultData,
      updated_at: new Date().toISOString(),
      updated_by: "initial_setup"
    };

    const { error } = await client
      .from(cfg.tableName)
      .upsert(payload, { onConflict: "id" });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Subscribe to Live Realtime Changes across all browsers
 */
window.subscribeSupabaseRealtime = function(onDataChange) {
  const client = window.getSupabaseClient();
  if (!client) return null;

  const cfg = getSupabaseConfig();

  try {
    if (_realtimeChannelInstance) {
      client.removeChannel(_realtimeChannelInstance);
    }

    _realtimeChannelInstance = client
      .channel("portfolio_realtime_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: cfg.tableName,
          filter: `id=eq.${cfg.recordId}`
        },
        (payload) => {
          console.log("[Supabase Realtime] Received live update:", payload.eventType);
          if (payload.new && payload.new.data) {
            onDataChange(payload.new.data);
          }
        }
      )
      .subscribe((status) => {
        console.log("[Supabase Realtime] Channel status:", status);
      });

    return _realtimeChannelInstance;
  } catch (e) {
    console.error("[Supabase Realtime] Subscription error:", e);
    return null;
  }
};

/* ==========================================================================
   SUPABASE AUTH HELPERS (EMAIL / PASSWORD / FORGOT PASSWORD / SESSION)
   ========================================================================== */

/**
 * Sign In with Email & Password
 */
window.supabaseSignIn = async function(email, password) {
  const client = window.getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase is not configured yet. Please enter your credentials." };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Sign Up (Create new admin user if enabled in Supabase)
 */
window.supabaseSignUp = async function(email, password) {
  const client = window.getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase is not configured yet." };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Send Password Reset Email (Forgot Password)
 */
window.supabaseResetPassword = async function(email) {
  const client = window.getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase is not configured yet." };
  }

  try {
    // Current URL for redirect
    const redirectUrl = window.location.origin + window.location.pathname;
    const { data, error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      message: "Password reset link has been sent to your email. Please check your inbox and spam folder." 
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Update User Password (after clicking reset link or from settings)
 */
window.supabaseUpdatePassword = async function(newPassword) {
  const client = window.getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase is not configured." };
  }

  try {
    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Sign Out
 */
window.supabaseSignOut = async function() {
  const client = window.getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn("[Supabase] Signout error:", e);
    }
  }
  sessionStorage.removeItem("rammohan_admin_auth_v3");
  return { success: true };
};

/**
 * Get Current Authenticated User & Session
 */
window.supabaseGetCurrentUser = async function() {
  const client = window.getSupabaseClient();
  if (!client) return null;

  try {
    const { data: { session } } = await client.auth.getSession();
    if (session && session.user) {
      return session.user;
    }
    return null;
  } catch (e) {
    return null;
  }
};

/**
 * Upload Image / File to Supabase Storage Bucket (Optional)
 */
window.supabaseUploadFile = async function(file, customPath) {
  const client = window.getSupabaseClient();
  if (!client) return { success: false, error: "Supabase not configured" };

  const cfg = getSupabaseConfig();
  try {
    const ext = file.name ? file.name.split('.').pop() : 'jpg';
    const filePath = customPath || `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { data, error } = await client.storage
      .from(cfg.storageBucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from(cfg.storageBucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl, path: filePath };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

/**
 * Delete a File from Supabase Storage by its path
 * filePath should be the path returned by supabaseUploadFile() (e.g. "uploads/123_abc.jpg")
 */
window.supabaseDeleteFile = async function(filePath) {
  const client = window.getSupabaseClient();
  if (!client) return { success: false, error: "Supabase not configured" };
  if (!filePath) return { success: false, error: "No file path provided" };

  const cfg = getSupabaseConfig();
  try {
    const { error } = await client.storage
      .from(cfg.storageBucket)
      .remove([filePath]);

    if (error) {
      console.warn("[Supabase Storage] Delete error:", error.message);
      return { success: false, error: error.message };
    }

    console.log("[Supabase Storage] Deleted:", filePath);
    return { success: true };
  } catch (e) {
    console.error("[Supabase Storage] Exception deleting file:", e);
    return { success: false, error: e.message };
  }
};

/**
 * Extract Supabase Storage file path from a public URL
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/portfolio-media/uploads/abc.jpg"
 * returns "uploads/abc.jpg"
 */
window.supabaseExtractFilePath = function(publicUrl) {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  if (publicUrl.startsWith("data:")) return null; // base64 — skip

  const cfg = getSupabaseConfig();
  const marker = `/storage/v1/object/public/${cfg.storageBucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.substring(idx + marker.length);
};

/**
 * Delete multiple Supabase Storage files from an array of public URLs
 * Automatically skips base64 / non-storage URLs
 */
window.supabaseDeleteFilesFromUrls = async function(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return;
  const paths = urls
    .map(u => window.supabaseExtractFilePath(u))
    .filter(Boolean);

  if (paths.length === 0) return;

  const client = window.getSupabaseClient();
  if (!client) return;
  const cfg = getSupabaseConfig();

  try {
    const { error } = await client.storage
      .from(cfg.storageBucket)
      .remove(paths);

    if (error) {
      console.warn("[Supabase Storage] Bulk delete error:", error.message);
    } else {
      console.log(`[Supabase Storage] Deleted ${paths.length} files:`, paths);
    }
  } catch (e) {
    console.error("[Supabase Storage] Exception in bulk delete:", e);
  }
};

/**
 * Get Supabase Storage usage — lists all files in bucket and sums their sizes
 * Returns: { success, usedBytes, usedMB, fileCount, limitMB, percentUsed }
 * NOTE: Supabase Free plan = 1 GB storage limit
 */
window.supabaseGetStorageUsage = async function() {
  const client = window.getSupabaseClient();
  if (!client) return { success: false, error: "Supabase not configured" };

  const cfg = getSupabaseConfig();
  const LIMIT_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB free plan limit

  try {
    // List all files recursively from uploads/ folder
    const { data, error } = await client.storage
      .from(cfg.storageBucket)
      .list("uploads", {
        limit: 1000,
        offset: 0
      });

    if (error) {
      // If bucket doesn't exist yet or access denied
      console.warn("[Supabase Storage] List error:", error.message);
      return { success: false, error: error.message };
    }

    const files = data || [];
    const usedBytes = files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
    const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
    const limitMB = (LIMIT_BYTES / (1024 * 1024)).toFixed(0);
    const percentUsed = Math.min(100, ((usedBytes / LIMIT_BYTES) * 100)).toFixed(1);

    return {
      success: true,
      usedBytes,
      usedMB: parseFloat(usedMB),
      fileCount: files.length,
      limitMB: parseInt(limitMB),
      limitGB: 1,
      percentUsed: parseFloat(percentUsed)
    };
  } catch (e) {
    console.error("[Supabase Storage] Exception getting usage:", e);
    return { success: false, error: e.message };
  }
};
