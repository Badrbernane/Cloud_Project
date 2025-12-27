import { AZURE_FUNCTIONS } from '../config/config';

// Optional function key (if your function requires it)
// Put in frontend/.env : REACT_APP_AZURE_FUNC_KEY=xxxxx
const FUNCTION_KEY = process.env.REACT_APP_AZURE_FUNC_KEY;

function buildUrl() {
  const base = AZURE_FUNCTIONS.WELCOME_EMAIL;
  if (FUNCTION_KEY) {
    return base.includes('?') ? `${base}&code=${FUNCTION_KEY}` : `${base}?code=${FUNCTION_KEY}`;
  }
  return base;
}

/**
 * Try sending email. First attempt normal fetch.
 * If it fails due to CORS/network, fallback to no-cors (opaque response).
 */
export async function sendWelcomeEmail(email, name) {
  const payload = { email, name };
  const url = buildUrl();

  // Attempt 1: normal fetch
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(FUNCTION_KEY ? { 'x-functions-key': FUNCTION_KEY } : {}),
      },
      body: JSON.stringify(payload),
    });
    const text = await resp.text().catch(() => '');
    if (!resp.ok) {
      console.warn('Azure Function non-OK:', resp.status, text);
      return { ok: false, status: resp.status, body: text };
    }
    return { ok: true, status: resp.status, body: text };
  } catch (err) {
    console.warn('Erreur envoi email (normal fetch):', err);
  }

  // Attempt 2: fallback no-cors (will be opaque; best-effort)
  try {
    const resp2 = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        ...(FUNCTION_KEY ? { 'x-functions-key': FUNCTION_KEY } : {}),
      },
      body: JSON.stringify(payload),
    });
    // Opaque response; assume success best-effort
    console.debug('no-cors fallback used for email');
    return { ok: true, opaque: true };
  } catch (err2) {
    console.warn('Erreur envoi email (no-cors fallback):', err2);
    return { ok: false, error: err2?.message || String(err2) };
  }
}

export default { sendWelcomeEmail };
