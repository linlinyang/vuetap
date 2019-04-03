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
        supportTouch  = !!document && 'touchend' in document,
        supportPassive = false,
        captureSupport = false,
        onceSupport = false;

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

        window.addEventListener('test',null,option);
    }catch(e){}
    
    function forceMerge(to,from){
        var keys = from.keys(),
            len = keys.length;

        while(len--){
            var tempKey = keys[len];
            if(to[tempKey] === undefined){
                to[tempKey] = from[tempKey];
            }else{
                to[tempKey] = to[tempKey] && from[tempKey];
            }
        }

        return to;
    }

    if(!Element.prototype.bindEvent){
        var oListeners = [];
        Element.prototype.bindEvent = function(type,handler,options){
            
        };
    }

    var oldX = oldY = startTime = 0;
    function createTouchStart(modifiers,handlerObj){
        return function(e){
            
        };
    }
    function createTouchMove(modifiers,handlerObj){
        
    }
    function createTouchEnd(modifiers,handlerObj){
        return function(e){
            var curEl = e.currentElement,
                targetEl = e.target || e.srcElement;
            
            
        };
    }

    var vueTap = {
        bind(el,binding){
            var handler = binding.value;
            handler = typeof handler === 'function'
                        ? handler
                        : typeof handler.handler === 'function'
                            ? handler.handler
                            : null;
            var modifiers = forceMerge({
                passive: true,
                capture: false,
                once: false,
                prevent: false,
                stop: false,
                self: false
            },binding.modifiers);
            el.bindEvent('click',function(){},modifiers);                     
        },
        unbind(el,binding){
        }
    };

    function _install(vue){
        if(_install.installed){
            return ;
        }
        _install.installed = true;
        vue.directive('tap',vueTap);
    }

    vueTap.version = '1.0.0';
    vueTap.install = _install;

    if(inBrowser && window.Vue){
        window.Vue.use(vueTap);
    }

    return vueTap;
});