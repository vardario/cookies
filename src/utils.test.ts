import randomBytes from 'randombytes';
import { CookieProps } from './cookies';
import { setupJsDom } from './test-utils';

import { clearCookie, getCookie, setCookie } from './utils';

setupJsDom();

const cookieProps: CookieProps = {
  domain: 'localhost',
  path: '/',
};

test('CookieSessionStorage:utils', () => {
  const smallPayload = randomBytes(32).toString('ascii');
  setCookie('smallPayload', smallPayload, cookieProps);
  expect(getCookie('smallPayload')).toBe(smallPayload);

  const largePayload = randomBytes(8192).toString('ascii');
  setCookie('largePayload', largePayload, cookieProps);
  expect(getCookie('largePayload')).toBe(largePayload);

  const extraLargePayload = randomBytes(16384).toString('ascii');
  setCookie('extraLargePayload', extraLargePayload, cookieProps);
  expect(getCookie('extraLargePayload')).toBe(extraLargePayload);

  clearCookie('smallPayload', cookieProps);
  expect(getCookie('smallPayload')).toBeUndefined();
});
