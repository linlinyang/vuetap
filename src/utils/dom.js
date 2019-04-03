const inBrowser = typeof window !== 'undefined';
const supportTouch = !!document && 'ontouchend' in document;

export {
    inBrowser,
    supportTouch
};