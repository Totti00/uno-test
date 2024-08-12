// jest.setup.js
import '@testing-library/jest-dom';
global.Image = class {
  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
  // Mock src setter
  set src(_src) {
    this._src = _src;
    if (this.onload) {
      setTimeout(() => {
        this.onload();
      }, 0);
    }
  }
  get src() {
    return this._src;
  }
};

if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn) => setTimeout(fn, 0);
}

// Mock di window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});