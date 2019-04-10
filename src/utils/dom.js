/* /src/utils/dom.js */

import equal from './equal';

const inBrowser = typeof window !== 'undefined';
const touchSupport = !!document && 'ontouchend' in document;
let passiveSupport = false;//是否支持事件监听的passive

try{

    var opt = Object.defineProperty({},'passive',{
        get(){
            passiveSupport = true;
        }
    });
    window.addEventListener('passive-test',null,opt);

}catch(e){}

if(!Element.prototype.bind){//封装事件监听
    /* 
    * dom元素添加监听事件，缓存监听
    *
    * @params {type} String;事件名称
    * @params {handler} Function;事件回调
    * @params {modifiers} Object;事件修饰符
    */
    Element.prototype.bind = function(type,handler,modifiers){
        free(this,type,modifiers);//释放相同元素相同修饰符已经绑定的事件
        const caches = this._cacheEvents || (this._cacheEvents = []);
        caches.push(Object.assign(Object.create(null),{
            type,
            handler,
            modifiers
        }));
        let options = passiveSupport 
        ? {
            capture: modifiers.capture,
            passive: modifiers.passive
        } 
        : modifiers.capture;
        this.addEventListener(type,handler,options);
    }
}

if(!Element.prototype.unbind){//封装释放事件监听
    /* 
    * dom元素移除监听事件，清除监听缓存
    *
    * @params {type} String;事件名称
    * @params {modifiers} Object;指令修饰符
    */
    Element.prototype.unbind = function(type,modifiers){
        free(this,type,modifiers);
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
function free(el,type,modifiers){
    if(!el || !type){return ;}
    const caches = el._cacheEvents || (el._cacheEvents = []);
    let left = caches.length >> 1;
    let right = left + 1;
    let prev = caches[left],
        next = caches[right],
        removeCachesIndex = [];
    const options = passiveSupport 
        ? {
            capture: modifiers.capture,
            passive: modifiers.passive
        } 
        : modifiers.capture;

    while(prev || next){
        if(
            prev 
            && prev.type === type 
            && equal(prev.modifiers,modifiers) 
        ){
            el.removeEventListener(prev.type,prev.handler,options);
            caches.splice(left,1);
            return prev.handler;
        }
        if(
            next 
            && next.type === type 
            && equal(next.modifiers,modifiers) 
        ){
            el.removeEventListener(right.type,right.handler,options);
            caches.splice(right,1);
            return right.handler;
        }
        prev = caches[--left];
        next = caches[++right];
    }

    return null;
}

export {
    inBrowser,
    touchSupport,
    passiveSupport
};