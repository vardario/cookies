import { CookieProps } from './cookies.js';

const DAY_IN_MILLISECONDS = 8.64e7;
const MAX_SIZE_PER_COOKIE = 4096;

function getCookieParams(key: string, value: string, props: CookieProps) {
  const nowTimeStamp = new Date().getTime();
  const cookieParams = [`${key}=${value}`, `path=${props.path}`, `Domain=${props.domain}`];
  props.expires !== undefined &&
    cookieParams.push(`expires=${new Date(nowTimeStamp + props.expires * DAY_IN_MILLISECONDS)}`);

  return cookieParams;
}

function _setCookie(key: string, value: string, props: CookieProps) {
  const cookieParams = getCookieParams(key, value, props);
  document.cookie = cookieParams.join('; ');
}

export function setCookie(key: string, value: string, props: CookieProps) {
  clearCookie(key, props);

  /**
   * The sum of the key and value including all params can't exceed 4096 Bytes
   * @see https://github.com/httpwg/http-extensions/blob/main/draft-ietf-httpbis-rfc6265bis.md#the-set-cookie-header-field-set-cookie
   */
  const cookieStringWithoutValueParam = getCookieParams('key.00', '', props).join('; ');
  const MAX_CONTENT_SIZE = MAX_SIZE_PER_COOKIE - cookieStringWithoutValueParam.length;

  const stringArray = Buffer.from(value).toString('base64').split('');
  const chunkCount = Math.ceil(stringArray.length / MAX_CONTENT_SIZE);

  for (let chunkIndex = 0; chunkIndex < chunkCount; ++chunkIndex) {
    const start = chunkIndex * MAX_CONTENT_SIZE;
    const end = start + MAX_CONTENT_SIZE;
    const chunk = stringArray.slice(start, end);

    _setCookie(`${key}.${chunkIndex}`, chunk.join(''), props);
  }
}

export function clearCookie(key: string, props: CookieProps) {
  const cookies = getCookies();
  let index = 0;

  while (cookies[`${key}.${index}`]) {
    _setCookie(`${key}.${index}`, '', { ...props, expires: 0 });
    ++index;
  }
}

export function getCookies() {
  return decodeURIComponent(document.cookie)
    .split('; ')
    .reduce((cookies, cookie) => {
      const [key, value] = cookie.split('=');
      cookies[key] = value;
      return cookies;
    }, {} as Record<string, string>);
}

export function getCookie(name: string): string | undefined {
  const cookies = getCookies();

  let index = 0;
  const key = () => `${name}.${index}`;
  let value: string | undefined;

  while (cookies[key()]) {
    if (value === undefined) {
      value = '';
    }
    value += cookies[key()];
    ++index;
  }

  return value ? Buffer.from(value, 'base64').toString() : undefined;
}
