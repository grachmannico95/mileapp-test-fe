export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop().split(";").shift();
    return decodeURIComponent(cookieValue);
  }

  return null;
}

export function getCsrfToken() {
  return getCookie("csrf_token");
}

export function getAccessToken() {
  return getCookie("access_token");
}

export function isAuthenticated() {
  return !!getAccessToken();
}
