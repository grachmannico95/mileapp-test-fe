export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop().split(";").shift();
    return decodeURIComponent(cookieValue);
  }

  return null;
}

export function setAccessToken(token) {
  localStorage.setItem("access_token", token);
}

export function setCsrfToken(token) {
  localStorage.setItem("csrf_token", token);
}

export function getAccessTokenFromStorage() {
  return localStorage.getItem("access_token");
}

export function getCsrfTokenFromStorage() {
  return localStorage.getItem("csrf_token");
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("csrf_token");
}

// Hybrid approach: check localStorage first, fallback to cookies
export function getCsrfToken() {
  return getCsrfTokenFromStorage() || getCookie("csrf_token");
}

export function getAccessToken() {
  return getAccessTokenFromStorage() || getCookie("access_token");
}

export function isAuthenticated() {
  return !!getAccessToken();
}
