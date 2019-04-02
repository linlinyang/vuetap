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

    var _Vue;
    var inBrowser = window !== undefined;
    var hasTouch  = !!document && 'touchend' in document;

    function touchStart(e){}
    function touchMove(e){}
    function touchEnd(e){}
    function click(e){}

    var vueTap = {
        bind(el,binding){
            var handler = binding.value;
            if(hasTouch){
                el.addEventListener('touchstart',touchStart,!!binding.modifiers.capture);
            }
        },
        unbind(el,binding){
            if(hasTouch){
                el.removeEventListener('touchstart',touchStart,!!binding.modifiers.capture);
            }
        }
    };

    function _install(vue){
        if(install.installed && _Vue === vue){
            return ;
        }
        install.installed = true;
        _Vue = vue;

        vue.derective('tap',vueTap);
    }

    vueTap.version = '1.0.0';
    vueTap.install = _install;

    if(inBrowser && window.Vue){
        window.Vue.use(VueTap);
    }

    return vueTap;
});