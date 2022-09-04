import { after } from "ospec";
import { JSDOM } from "jsdom";

// Require Mithril.js to make sure it loads properly.
import "mithril";
import { vi } from "vitest";
const dom = new JSDOM("", {
    // So we can get `requestAnimationFrame`
    pretendToBeVisual: true,
});

// Fill in the globals Mithril.js needs to operate. Also, the first two are often
// useful to have just in tests.
global.window = dom.window;
global.document = dom.window.document;
global.requestAnimationFrame = dom.window.requestAnimationFrame;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})// And now, make sure JSDOM ends when the tests end.

after(function () {
    dom.window.close();
});