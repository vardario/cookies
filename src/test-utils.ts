import { JSDOM } from 'jsdom';

export function setupJsDom() {
  const dom = new JSDOM('', {
    url: 'http://localhost',
  });
  global.document = dom.window.document;
  global.window = dom.window as any;
}
