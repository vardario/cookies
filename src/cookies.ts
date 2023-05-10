import { clearCookie, getCookie, getCookies, setCookie } from './utils.js';

/**
 * Cookie parameters according to
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 */
export interface CookieProps {
  /**
   * Defines to which domain this cookie belongs to.
   */
  domain: string;

  /**
   * Indicates the path that must exist in the requested URL.
   */
  path?: string;

  /**
   * Maximum lifetime of the of the cookie in days
   * If not set, the cookies is only valid for a session.
   * @default  undefined
   */
  expires?: number;

  /**
   * Indicates that the cookie is sent to the server only when a request is made with the https: scheme.
   */
  secure?: boolean;

  /**
   * Controls whether or not a cookie is sent with cross-site requests,
   * providing some protection against cross-site request forgery attacks
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export class Cookies {
  constructor(private readonly props: CookieProps) {}

  getCookies() {
    return getCookies();
  }

  getCookie(name: string) {
    return getCookie(name);
  }

  setCookie(key: string, value: string) {
    setCookie(key, value, this.props);
  }

  clearCookie(key: string) {
    clearCookie(key, this.props);
  }
}
