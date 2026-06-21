import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME } from './constants';


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
