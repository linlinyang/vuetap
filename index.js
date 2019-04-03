/*!
 * vue tap directive v1.0.0
 * https://github.com/linlinyang/vuetap
 *
 * (c) 2019 Yang lin 
 */

(function(global,factory){

    if(typeof exports === 'object' && typeof module !== 'undefined'){
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
        define(factory);
    }else{
        global.vueTap = factory();
    }

})(this,function(){
    "use strict";

    var inBrowser = window !== undefined,
        supportTouch  = !!document && 'ontouchend' in document,
        supportPassive = false,
        captureSupport = false,
        onceSupport = false,
        toString = Object.prototype.toString;

    try{

        var option = Object.defineProperties({},{
            passive: {
                get: function(){
                    supportPassive = true;
                }
            },
            capture: {
                get: function(){
                    captureSupport = true;
                }
            },
            once: {
                get: function(){
                    onceSupport = true;
                }
            }
        })

        window.addEventListener('passive-test',null,option);
    }catch(e){}

    function free(el){
        if(el._cacheEvent === undefined){
            el._cacheEvent = [];
        }
        var caches = el._cacheEvent,
            len = caches.length;
        while(len--){
            var tempEvent = caches[len];
            el.removeEventListener(tempEvent.type,tempEvent.handler,tempEvent.options);
        }

        delete el._cacheEvent;
    }

    if(!Element.prototype.bindEvent){
        Element.prototype.bindEvent = function(type,handler,options){
            if(this._cacheEvent === undefined){
                this._cacheEvent = [];
            }
            var caches = this._cacheEvent;
            this.addEventListener(type,handler,options);
            caches.push({
                type: type,
                handler: handler,
                options: options
            });
        };
    }
    
    var oldX = 0,
        oldY = 0,
        startTime = 0,
        oldEl = null;
    function createTouchStart(modifiers){
        return function(e){
            startTime = new Date();
            var touch = e.touches && e.touches.length == 1 
                        ? e.touches[0]
                        : e;
            oldX = touch.clientX;
            oldY = touch.clientY;
            oldEl = touch.currentTarget;

            if(modifiers.stop){
                e.stopPropagation();
            }
            if(!modifiers.passive && modifiers.prevent){
                e.preventDefault();
            }

        };
    }
    function createTouchEnd(modifiers,handlerObj,args){
        return function(e){
            var now = new Date(),
                touch = e.changedTouches && e.changedTouches.length == 1
                        ? e.changedTouches[0]
                        : e,
                curX = touch.clientX,
                curY = touch.clientY,
                curEl = touch.currentTarget,
                targetEl = touch.target || touch.srcElement;
                
            if(modifiers.stop){
                e.stopPropagation();
            }
            if(!modifiers.passive && modifiers.prevent){
                e.preventDefault();
            }

            var disX = Math.abs(curX - oldX),
                disY = Math.abs(curY - oldY);
            if(now - startTime < 300){
                if(disX < 10 && disY < 10){//触发点击事件
                    if((modifiers.self && oldEl === targetEl && curEl === targetEl) || !modifiers.self){
                        var exec = typeof handlerObj === 'function'
                                    ? handlerObj
                                    : typeof handlerObj.tap === 'function'
                                        ? handlerObj.tap
                                        : null;
                                        
                        exec && exec.call(targetEl,e,args);
                        modifiers.once && free(targetEl);
                    }
                }
            }else if(disX > 30 || disY > 30){
                if(disX > disY){//水平方向
                    if(curX - oldX > 30){//右滑
                        console.log('aaa');
                        typeof handlerObj.tapRight === 'function' && handlerObj.tapRight.call(targetEl,e,args);
                        modifiers.once && free(targetEl);
                    }else if(curX - oldX < -30){//左滑
                        console.log('ss');
                        typeof handlerObj.tapLeft === 'function' && handlerObj.tapLeft.call(targetEl,e,args);
                        modifiers.once && free(targetEl);
                    }
                }else{//垂直方向
                    if(curY - oldY > 30){//下滑
                        typeof handlerObj.tapDown === 'function' && handlerObj.tapDown.call(targetEl,e,args);
                        modifiers.once && free(targetEl);
                    }else if(curY - oldY < -30){//上滑
                        typeof handlerObj.tapUp === 'function' && handlerObj.tapUp.call(targetEl,e,args);
                        modifiers.once && free(targetEl);
                    }
                }
            }
        };
    }

    var vueTap = {
        bind: function(el,binding){
            var modifiers = binding.modifiers || Object.create(null),
                option = supportPassive
                        ? {
                            capture: modifiers.capture,
                            passive: modifiers.passive
                        }
                        : modifiers.capture;
                            
            free(el);
            if(supportTouch){
                el.bindEvent('touchstart',createTouchStart(modifiers),option);
                el.bindEvent('touchend',createTouchEnd(modifiers,binding.value,binding.arg),option);
            }else{
                el.bindEvent('mousedown',createTouchStart(modifiers),option);
                el.bindEvent('mouseup',createTouchEnd(modifiers,binding.value,binding.arg),option);
            }
        },
        unbind: function(el,binding){
            free(el);
        }
    };

    function _install(vue){
        if(_install.installed){
            return ;
        }
        _install.installed = true;
        vue.directive('vueTap',vueTap);
    }

    vueTap.version = '1.0.0';

    if(inBrowser && window.Vue){
        vueTap.install = _install;
        window.Vue.use(vueTap);
    }

    return vueTap;
});