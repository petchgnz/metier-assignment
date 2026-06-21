import Cookies from 'js-cookie';

export const TOKEN_COOKIE_NAME = 'admin_token';

//set auth token to cookies
export function setAuthToken(token: string) {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 1,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

//get auth token from cookies
export function getAuthToken() {
  return Cookies.get(TOKEN_COOKIE_NAME);
}

//clear auth token from cookies
export function clearAuthToken() {
  Cookies.remove(TOKEN_COOKIE_NAME);
}
