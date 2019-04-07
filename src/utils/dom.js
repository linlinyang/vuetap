/* /src/utils/dom.js */

import equal from './equal';

const inBrowser = typeof window !== 'undefined';
const touchSupport = !!document && 'ontouchend' in document;
let passiveSupport = false;

try{

    var opt = Object.defineProperty({},'passive',{
        get(){
            passiveSupport = true;
        }
    });
    window.addEventListener('passive-test',null,opt);

}catch(e){}

if(!Element.prototype.bind){
    Element.prototype.bind = function(type,handler,modifiers){
        free(this,type,handler,modifiers);
        const caches = this._cacheEvents || (this._cacheEvents = []);
        caches.push({
            type,
            handler,
            modifiers
        });
        let options = passiveSupport ? {
            capture: modifiers.capture,
            passive: modifiers.passive
        } : modifiers.capture;
        this.addEventListener(type,handler,options);
    }
}

if(!Element.prototype.unbind){
    Element.prototype.unbind = function(type,modifiers){
        const handler = free(this,type,modifiers);
        let options = passiveSupport ? {
            capture: modifiers.capture,
            passive: modifiers.passive
        } : modifiers.capture;
        this.removeEventListener(type,handler,options);
    };
}

function free(el,type,modifiers){
    if(!el || !type){return ;}
    const caches = el._cacheEvents || (el._cacheEvents = []);
    let left = caches.length >> 1;
    let right = left + 1;
    let prev = caches[left],
        next = caches[right];

    while(prev || next){
        if(
            prev 
            && prev.type === type 
            && equal(prev.modifiers,modifiers) 
        ){
            removeCachesIndex.push(left);
            el.unbind(prev.type,prev.handler,prev.modifiers);
            caches.splice(left,1);
            return prev.handler;
        }
        if(
            next 
            && next.type === type 
            && equal(next.modifiers,modifiers) 
        ){
            removeCachesIndex.push(right);
            el.unbind(right.type,right.handler,right.modifiers);
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