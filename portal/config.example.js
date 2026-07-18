// Copy to config.js and fill from your Supabase project settings → API.
// config.js IS committed on purpose: this is a static, git-deployed site, so the
// browser needs the config at runtime. That is safe, the publishable/anon key is
// public by design and RLS protects all data. NEVER put the service-role key here.
window.AISW_CONFIG = {
  url:  "https://YOUR-PROJECT-ref.supabase.co",
  anon: "YOUR-ANON-PUBLIC-KEY",
};
