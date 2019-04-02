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
    var supportTouch  = !!document && 'touchend' in document;
    var supportPassive = false;

    try{

        var option = Object.defineProperty({},'passive',{
            get: function(){
                supportPassive = true;
                option = null;
            }
        })

        window.addEventListener('test',null,option);
    }catch(e){}
    
    function Handler(el,options,modifiers){
        Object.assign(this,{
            el: el,
            stop: false,//是否阻止事件冒泡
            prevent: false,//是否组织事件默认操作
            capture: false,//false: 事件冒泡; true: 事件捕获
            self: false,//为true则绑定事件和触发事件元素必须是同一个
            once: false,//事件只触发一次
        },options,modifiers);
        //this.passive = supportPassive && (this.passive || true);//忽略阻止默认事件
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
    }
    Handler.prototype.init = function(){
        /* var el = this.el,
            capture = !!this.modifiers.capture; */
        /* if(supportTouch){
            var touchStartHandler = this.touchStartHandler = this.touchStart.bind(this),
                touchEndHandler = this.touchEndHandler = this.touchEnd.bind(this);
            el.addEventListener('touchstart',touchStartHandler,capture);
            el.addEventListener('touchend',touchEndHandler,capture);
        }else{ */
            var clickHandler = this.clickHandler = this.click.bind(this);
            this.el.addEventListener('click',clickHandler,false);
        //}
    };
    Handler.prototype.touchStart = function(e){
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startTime = new Date();
        this.modifiers.stop && e.stopPropagation();
    };
    Handler.prototype.touchEnd = function(e){
        
    };
    Handler.prototype.click = function(e){
        var modifiers = this.modifiers,
            el = this.el;
        console.log(eventHandler);
        /* modifiers.stop && e.stopPropagation();
        modifiers.prevent && e.preventDefault();
        
        if(this.callback){
            ((modifiers.self && el === e.srcElement) || (!modifiers.self)) && this.callback.call(el,e,this);;
        } */

    };
    Handler.prototype.execCallback = function(){
        var modifiers = this.modifiers,
            el = this.el;
        
        if(this.callback){
            if((modifiers.self && el === e.srcElement) || (!modifiers.self)){
                this.callback.call(el,e,this);
                modifiers.once && this.free();
            }
        }
    };
    Handler.prototype.free = function(){

        if(supportTouch){

        }else{
            this.el.removeElevtListener('click',this.clickHandler,);
        }
    };


    var eventHandler;

    var vueTap = {
        bind(el,binding){
            var handler = binding.value;
            handler = typeof handler === 'function'
                        ? handler
                        : typeof handler.handler === 'function'
                            ? handler.handler
                            : null;
                                 
            eventHandler = new Handler(el,{
                callback: handler,
                args: binding.arg
            },binding.modifiers);

            eventHandler.init();
        },
        unbind(el,binding){
            eventHandler.free();
            eventHandler = null;
        }
    };

    function _install(vue){
        if(_install.installed && _Vue === vue){
            return ;
        }
        _install.installed = true;
        _Vue = vue;
        vue.directive('tap',vueTap);
    }

    vueTap.version = '1.0.0';
    vueTap.install = _install;

    if(inBrowser && window.Vue){
        window.Vue.use(vueTap);
    }

    return vueTap;
});