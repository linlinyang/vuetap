/* !
  * vueTap v2.0.0
  * https://github.com/linlinyang/vuetap
  * 
  * (c) 2019 Yang Lin
  */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.vueTap = factory());
}(this, function () { 'use strict';

    var _toString = Object.prototype.toString;
    /* 
     * 判断对象是不是严格对象
    */

    function isPlainObject(obj) {
      return _toString.call(obj) === '[object Object]';
    }
    /*
     * 字符串转驼峰 
    */


    function camelize(str) {
      return str.replace(/-(\w)/g, function ($0, $1) {
        return $1.toUpperCase();
      });
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
    var passiveSupport = false; //是否支持事件监听的passive

    try {
      var opt = Object.defineProperty({}, 'passive', {
        get: function get() {
          passiveSupport = true;
        }
      });
      window.addEventListener('passive-test', null, opt);
    } catch (e) {}

    if (!Element.prototype.bind) {
      //封装事件监听

      /* 
      * dom元素添加监听事件，缓存监听
      *
      * @params {type} String;事件名称
      * @params {handler} Function;事件回调
      * @params {modifiers} Object;事件修饰符
      */
      Element.prototype.bind = function (type, handler, modifiers) {
        this.unbind(type, modifiers); //释放相同元素相同修饰符已经绑定的事件

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
      //封装释放事件监听

      /* 
      * dom元素移除监听事件，清除监听缓存
      *
      * @params {type} String;事件名称
      * @params {modifiers} Object;指令修饰符
      */
      Element.prototype.unbind = function (type, modifiers) {
        var handler = free(this, type, modifiers);
        var options = passiveSupport ? {
          capture: modifiers.capture,
          passive: modifiers.passive
        } : modifiers.capture;
        this.removeEventListener(type, handler, options);
      };
    }
    /* 
     * 查询dom元素已经绑定的相同类型相同修饰符的事件,并清空缓存
     * 
     * @params {el} Dom Object;要释放的dom对象
     * @params {type} String;事件类型
     * @params {modifiers} Object;指令修饰符
     * 
     * @return Function|null;存在则返回该元素已经绑定过的回调，否则返回null
    */


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
    /* 
     * 创建touchstart监听事件，点击开始缓存位置、事件、和触发元素等属性
     * 
     * @params {modifiers} Object;指令修饰符
     * 
     * @return Function;闭包指令修饰符，返回监听事件
    */

    function createTouchStart(modifiers) {
      return function (event) {
        var e = event.touches ? event.touches[0] : event;
        startX = e.clientX;
        startY = e.clientY;
        starttime = new Date();
        oldTargetEl = event.currentTarget;
        modifiers.stop && event.stopPropagation();
        modifiers.prevent && event.preventDefault();
      };
    }
    /* 
     * 创建touchend监听事件，执行指令对应的回调函数
     *
     * @params {binding} Object;vue自定义指令bind回调对象
     * @params {modifiers} Object;指令修饰符
     * @params {directiveName} String;指令属性名称
     * 
     * @return Function;返回监听事件回调函数
    */


    function createTouchEnd(binding, modifiers, directiveName) {
      return function (event) {
        var e = event.changedTouches ? event.changedTouches[0] : event;
        var diffX = e.clientX - startX;
        var diffY = e.clientY - startY;
        var diffTime = new Date() - starttime;
        var targetEl = event.target || event.srcElement;
        var handlerObj = binding.value;

        if (modifiers.stop) {
          event.stopPropagation();
        }

        if (modifiers.prevent) {
          event.preventDefault();
        }

        var getHandler = parseHandler(directiveName, handlerObj);
        var handler = null;

        if (diffTime < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
          //执行点击事件，如果已绑定
          handler = getHandler('tap');
        } else {
          if (Math.abs(diffX) > Math.abs(diffY)) {
            //水平方向
            if (diffX > 30) {
              //执行右滑事件，如果已绑定
              handler = getHandler('swiperRight');
            } else if (diffX < -30) {
              //执行左滑事件，如果已绑定
              handler = getHandler('swiperLeft');
            }
          } else {
            //垂直方向
            if (diffY > 30) {
              //执行下滑事件，如果已绑定
              handler = getHandler('swiperDown');
            } else {
              //执行上滑事件，如果已绑定
              handler = getHandler('swiperUp');
            }
          }
        }

        if (modifiers.self && oldTargetEl === targetEl && event.currentTarget === targetEl || !modifiers.self) {
          //执行回调函数
          if (handler && typeof handler === 'function') {
            handler.call(targetEl, event, binding.arg);

            if (modifiers.once) {
              //只执行一次则释放指令
              if (touchSupport) {
                targetEl.unbind('touchstart', modifiers);
                targetEl.unbind('touchend', modifiers);
              } else {
                targetEl.unbind('mousedown', modifiers);
                targetEl.unbind('mouseup', modifiers);
              }
            }
          }
        }
      };
    }
    /* 
     * 解析指令绑定的值，返回获取根据指令属性返回回调函数的函数
     *
     * @params {directiveName} String;绑定的指令名称
     * @params {handlerObj} Function | Object;对调对象
     * 
     * @return Function;返回获取回调函数的函数
    */


    function parseHandler(directiveName, handlerObj) {
      directiveName = camelize(directiveName);
      return function (propName) {
        if (typeof handlerObj === 'function') {
          return directiveName === propName || propName === 'tap' ? handlerObj : null;
        }

        if (isPlainObject(handlerObj)) {
          return typeof handlerObj[propName] === 'function' ? handlerObj[propName] : null;
        }
      };
    }

    /* /src/core/init.js */
    /* 
     * 为对应的指令绑定对应的事件
     *
     * @params {directiveName} String;指令名称，只能是['vueTap',tap','swiperLeft','swiperRight','swiperDown','swiperUp']其中的一种
     * @params {el} Dom Object;指令绑定的元素
     * @params {binding} Object;Vue指令传入的binding对象，详情查看https://cn.vuejs.org/v2/guide/custom-directive.html
     * 
    */

    function bindFunc(directiveName, el, binding) {
      var modifiers = binding.modifiers;

      if (touchSupport) {
        el.bind('touchstart', createTouchStart(modifiers), modifiers);
        el.bind('touchend', createTouchEnd(binding, modifiers, directiveName), modifiers);
      } else {
        el.bind('mousedown', createTouchStart(modifiers), modifiers);
        el.bind('mouseup', createTouchEnd(binding, modifiers, directiveName), modifiers);
      }
    }
    var directTypes = ['tap', 'swiperLeft', 'swiperRight', 'swiperDown', 'swiperUp']; //vueTap可以使用的指令属性名称

    /* 
    * 初始化vueTap，为vueTap对象添加指令属性
    */

    function init(vueTap) {
      var len = directTypes.length;

      while (len--) {
        //为vueTap对象添加指令属性
        vueTap[directTypes[len]] = {
          bind: bindFunc.bind(null, directTypes[len]),
          componentUpdated: bindFunc.bind(null, directTypes[len]),
          unbind: vueTap.unbind
        };
      } //默认指令——vueTap


      vueTap.bind = bindFunc.bind(null, 'vueTap');
      vueTap.componentUpdated = bindFunc.bind(null, 'vueTap');
    }

    var vueTap = {
      unbind: function unbind(el, binding) {
        var modifiers = binding.modifiers;

        if (touchSupport) {
          el.unbind('touchstart', modifiers);
          el.unbind('touchend', modifiers);
        } else {
          el.unbind('mousedown', modifiers);
          el.unbind('mouseup', modifiers);
        }
      }
    };
    init(vueTap);
    vueTap.version = '2.0.0';

    if (inBrowser) {
      //在浏览器中安装该插件
      vueTap.install = function (vue) {
        vue.directive('vueTap', vueTap);
      };

      Vue && Vue.use(vueTap);
    }

    return vueTap;

}));
