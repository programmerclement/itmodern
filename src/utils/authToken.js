const STORAGE_KEY = 'itmodern_auth_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable — session just won't survive a reload
  }
}

export function clearStoredToken() {
  setStoredToken(null);
}
