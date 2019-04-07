import { inBrowser,touchSupport,passiveSupport } from './utils/dom';
import { createTouchStart,createTouchEnd } from './core/index';
import inject from './core/inject';

const vueTap = {
    bind(el,binding){
        const modifiers = binding.modifiers;
        console.log(arguments);
        if(touchSupport){
            el.bind('touchstart',createTouchStart(modifiers),modifiers);
            el.bind('touchend',createTouchEnd(binding,modifiers),modifiers);
        }else{
            el.bind('mousedown',createTouchStart(modifiers),modifiers);
            el.bind('mouseup',createTouchEnd(binding,modifiers),modifiers);
        }
    },
    unbind(el,binding){
        if(touchSupport){
            el.unbind('touchstart',modifiers);
            el.unbind('touchend',modifiers);
        }else{
            el.unbind('mousedown',modifiers);
            el.unbind('mouseup',modifiers);
        }
    }
};

inject(vueTap);
vueTap.componentUpdated = vueTap.bind;

vueTap.version = '__VERSION__';
if(inBrowser){
    vueTap.install = (vue) => {
        vue.directive('vueTap',vueTap);
    };
    Vue && Vue.use(vueTap);
}

export default vueTap;