/* !
  * vueTap v2.0.0
  * https://github.com/linlinyang/vuetap
  * 
  * (c) 2019 Yang Lin
  */

'use strict';

var _toString = Object.prototype.toString;

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

/* /src/utils/equal.js */
/*
 * 检查两个对象是否相等，只检查自身属性，不检查隐式原型
 * 
 * @params{objA} Object
 * @params{objB} Object
 * @params{strict} Boolean;是否严格相等
*/

function equal(objA, objB, strict) {
  if (!isPlainObject(objA) || !isPlainObject(objB)) {
    return false;
  }

  var keysA = Object.keys(objA),
      keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var len = keysA.length,
      ret = true;

  while (len--) {
    var tempKey = keysA[len],
        valA = objA[tempKey],
        valB = objB[tempKey];

    if (isPlainObject(valA) || isPlainObject(valB)) {
      if (valA === objB || valB === objA || valA === objA || valB === objB) {
        //是否循环引用
        continue;
      } else {
        equal(valA, valB);
      }
    }
  }

  return ret;
}

/* /src/utils/dom.js */
var inBrowser = typeof window !== 'undefined';
var touchSupport = !!document && 'ontouchend' in document;
var passiveSupport = false;

try {
  var opt = Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupport = true;
    }
  });
  window.addEventListener('passive-test', null, opt);
} catch (e) {}

if (!Element.prototype.bind) {
  Element.prototype.bind = function (type, handler, modifiers) {
    free(this, type, handler, modifiers);
    var caches = this._cacheEvents || (this._cacheEvents = []);
    caches.push({
      type: type,
      handler: handler,
      modifiers: modifiers
    });
    var options = passiveSupport ? {
      capture: modifiers.capture,
      passive: modifiers.passive
    } : modifiers.capture;
    this.addEventListener(type, handler, options);
  };
}

if (!Element.prototype.unbind) {
  Element.prototype.unbind = function (type, modifiers) {
    var handler = free(this, type, modifiers);
    var options = passiveSupport ? {
      capture: modifiers.capture,
      passive: modifiers.passive
    } : modifiers.capture;
    this.removeEventListener(type, handler, options);
  };
}

function free(el, type, modifiers) {
  if (!el || !type) {
    return;
  }

  var caches = el._cacheEvents || (el._cacheEvents = []);
  var left = caches.length >> 1;
  var right = left + 1;
  var prev = caches[left],
      next = caches[right];

  while (prev || next) {
    if (prev && prev.type === type && equal(prev.modifiers, modifiers)) {
      removeCachesIndex.push(left);
      el.unbind(prev.type, prev.handler, prev.modifiers);
      caches.splice(left, 1);
      return prev.handler;
    }

    if (next && next.type === type && equal(next.modifiers, modifiers)) {
      removeCachesIndex.push(right);
      el.unbind(right.type, right.handler, right.modifiers);
      caches.splice(right, 1);
      return right.handler;
    }

    prev = caches[--left];
    next = caches[++right];
  }

  return null;
}

/* /src/core/index.js */
var startX = 0,
    startY = 0,
    starttime = 0,
    oldTargetEl = null;

function createTouchStart(modifiers) {
  return function (event) {
    var e = event.touches ? event.touches[0] : event;
    startX = e.clientX;
    startY = e.clientY;
    starttime = new Date();
    oldTargetEl = event.currentTarget;

    if (modifiers.stop) {
      event.stopPropagation();
    }

    if (modifiers.prevent) {
      event.preventDefault();
    }
  };
}

function createTouchEnd(binding, modifiers) {
  return function (event) {
    var e = event.touches ? event.touches[0] : event;
    var diffX = e.clientX - startX;
    var diffY = e.clientY - startY;
    var diffTime = new Date() - starttime;

    if (modifiers.stop) {
      event.stopPropagation();
    }

    if (modifiers.prevent) {
      event.preventDefault();
    }

    var handler;

    switch (binding.name) {
      case 'vue-tap':
        if (diffTime < 300 && Math.abs(diffX) < 10 && Math.abs(diffY)) {
          handler = binding.value;
        }

        break;

      case 'swiper-left':
        break;

      case 'swiper-right':
        break;

      case 'swiper-up':
        break;

      case 'swiper-down':
        break;
    }
  };
}

/* /src/core/inject.js */
var swiperTypes = ['swiperLeft', 'swiperRight', 'swiperDown', 'swiperUp'];

function inject(vueTap) {
  var len = swiperTypes.length;

  while (len--) {
    vueTap[swiperTypes[len]] = {
      bind: vueTap.bind,
      componentUpdated: vueTap,
      unbind: vueTap.unbind
    };
  }
}

var vueTap = {
  bind: function bind(el, binding) {
    var modifiers = binding.modifiers;

    if (touchSupport) {
      el.bind('touchstart', createTouchStart(modifiers), modifiers);
      el.bind('touchend', createTouchEnd(binding, modifiers), modifiers);
    } else {
      el.bind('mousedown', createTouchStart(modifiers), modifiers);
      el.bind('mouseup', createTouchEnd(binding, modifiers), modifiers);
    }
  },
  unbind: function unbind(el, binding) {
    if (touchSupport) {
      el.unbind('touchstart', modifiers);
      el.unbind('touchend', modifiers);
    } else {
      el.unbind('mousedown', modifiers);
      el.unbind('mouseup', modifiers);
    }
  }
};
inject(vueTap);
vueTap.componentUpdated = vueTap.bind;

if (inBrowser) {
  vueTap.install = function (vue) {
    vue.directive('vueTap', vueTap);
  };

  Vue && Vue.use(vueTap);
}

module.exports = vueTap;
