// ===== VISITOR COUNTER (Firebase Realtime Database) =====
// Firebase config is injected via Vite environment variables at build time.
// Keys are stored in GitHub Secrets (CI) or .env.local (local dev).
// They NEVER appear in the source repository.
//
// Counter strategy:
//   /visits           — incremented on EVERY page load (total page views)
//   /unique_visitors  — incremented only on FIRST visit per browser (localStorage UUID check)
//
// localStorage stores a UUID scoped to this domain. On return visits,
// the UUID is detected and only /visits is incremented. No personal
// data is stored — Firebase holds two integers, the browser holds one UUID.

const STORAGE_KEY = 'portfolio_visitor_id';

export async function initVisitorCounter() {
  const viewsEl = document.getElementById('visitCount');
  const uniqueEl = document.getElementById('uniqueCount');
  if (!viewsEl) return;

  // Read Firebase config from Vite env vars (replaced at build time)
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  // If env vars are missing (e.g., someone cloned the repo without secrets), fail silently
  if (!apiKey || !databaseURL || !projectId) {
    hideCounters(viewsEl, uniqueEl);
    return;
  }

  try {
    // Dynamically import Firebase SDK (only loads when needed)
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js');
    const { getDatabase, ref, runTransaction, get } = await import('https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js');

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
    const uniqueRef = ref(db, 'unique_visitors');

    // Check if this browser has visited before
    const isReturningVisitor = localStorage.getItem(STORAGE_KEY);

    // Always increment total page views
    const viewsResult = await runTransaction(visitsRef, (current) => (current ?? 0) + 1);

    if (viewsResult.committed) {
      const count = viewsResult.snapshot.val();
      viewsEl.textContent = `${count.toLocaleString()} views`;
      viewsEl.classList.add('loaded');
    }

    if (!isReturningVisitor) {
      // First visit — generate UUID, store it, increment unique counter
      const uuid = crypto.randomUUID?.() || generateFallbackUUID();
      localStorage.setItem(STORAGE_KEY, uuid);

      const uniqueResult = await runTransaction(uniqueRef, (current) => (current ?? 0) + 1);
      if (uniqueResult.committed && uniqueEl) {
        const count = uniqueResult.snapshot.val();
        uniqueEl.textContent = `${count.toLocaleString()} unique`;
        uniqueEl.classList.add('loaded');
      }
    } else {
      // Returning visitor — just read the current unique count
      if (uniqueEl) {
        const snapshot = await get(uniqueRef);
        const count = snapshot.val() || 0;
        uniqueEl.textContent = `${count.toLocaleString()} unique`;
        uniqueEl.classList.add('loaded');
      }
    }
  } catch (err) {
    // Fail silently — counters are nice-to-have, not critical
    console.warn('Visitor counter unavailable:', err.message);
    hideCounters(viewsEl, uniqueEl);
  }
}

function hideCounters(viewsEl, uniqueEl) {
  if (viewsEl?.closest('.visitor-counter')) viewsEl.closest('.visitor-counter').style.display = 'none';
  if (uniqueEl?.closest('.visitor-counter')) uniqueEl.closest('.visitor-counter').style.display = 'none';
}

// Fallback for browsers without crypto.randomUUID (older browsers)
function generateFallbackUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
