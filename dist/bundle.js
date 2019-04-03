(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    const inBrowser = typeof window !== 'undefined';
    const supportTouch = !!document && 'ontouchend' in document;

    console.log('rollup success');
    console.log(inBrowser);
    console.log(supportTouch);

}));
