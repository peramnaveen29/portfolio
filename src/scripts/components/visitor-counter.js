// ===== VISITOR COUNTER (Firebase Realtime Database) =====
// Firebase config is injected via Vite environment variables at build time.
// Keys are stored in GitHub Secrets (CI) or .env.local (local dev).
// They NEVER appear in the source repository.

export async function initVisitorCounter() {
  const counterEl = document.getElementById('visitCount');
  if (!counterEl) return;

  // Read Firebase config from Vite env vars (replaced at build time)
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  // If env vars are missing (e.g., someone cloned the repo without secrets), fail silently
  if (!apiKey || !databaseURL || !projectId) {
    counterEl.style.display = 'none';
    return;
  }

  try {
    // Dynamically import Firebase SDK (only loads when needed)
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js');
    const { getDatabase, ref, runTransaction } = await import('https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js');

    const app = initializeApp({
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });

    const db = getDatabase(app);
    const visitsRef = ref(db, 'visits');

    // Atomically increment the counter by 1
    const result = await runTransaction(visitsRef, (current) => (current ?? 0) + 1);

    if (result.committed) {
      const count = result.snapshot.val();
      counterEl.textContent = `${count.toLocaleString()} visits`;
      counterEl.classList.add('loaded');
    }
  } catch (err) {
    // Fail silently — counter is a nice-to-have, not critical
    console.warn('Visitor counter unavailable:', err.message);
    counterEl.style.display = 'none';
  }
}
