// Google sign-in for the blog thread.
//
// FRONTEND-ONLY MODE
//  - Without a client ID, signInWithGoogle() returns a demo reader after a short delay so the whole flow
//    (popup -> sign in -> react / comment / reply) can be reviewed. No account is created.
//  - Set VITE_GOOGLE_CLIENT_ID in .env and the same button opens the real Google account chooser
//    (Google Identity Services, popup token flow) and returns the visitor's name, email and photo.
//
// WHEN THE BACKEND IS READY: after Google returns the token, send it to your API (e.g. POST /api/auth/google),
// keep the session it returns, and make this function resolve with the user your API sends back.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const DEMO_AUTH = !CLIENT_ID;

let gsi;
export const preloadGoogle = () => {
  if (DEMO_AUTH || typeof document === "undefined") return Promise.resolve();
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!gsi) {
    gsi = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.onload = resolve;
      s.onerror = () => {
        gsi = null;
        reject(new Error("Google sign-in could not be loaded. Check your connection and try again."));
      };
      document.head.appendChild(s);
    });
  }
  return gsi;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function signInWithGoogle() {
  if (DEMO_AUTH) {
    await wait(900);
    return { id: "demo-reader", name: "Demo Reader", email: "", picture: "", provider: "demo" };
  }
  // Popup blockers need requestAccessToken() inside the click, so only await when the script is not ready yet.
  if (!window.google?.accounts?.oauth2) await preloadGoogle();
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid email profile",
      callback: async (resp) => {
        if (resp.error) return reject(new Error("Google sign-in was not completed."));
        try {
          const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${resp.access_token}` },
          });
          if (!r.ok) throw new Error();
          const u = await r.json();
          resolve({ id: u.sub, name: u.name || u.email, email: u.email, picture: u.picture || "", provider: "google" });
        } catch {
          reject(new Error("We could not read your Google profile. Please try again."));
        }
      },
      error_callback: (e) =>
        reject(new Error(e?.type === "popup_closed" ? "The Google window was closed before sign-in finished." : "Google sign-in was not completed.")),
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
}
