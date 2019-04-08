import { inBrowser,touchSupport } from './utils/dom';
import init from './core/index';

const vueTap = {
    unbind(el,binding){
        const modifiers = binding.modifiers;
        if(touchSupport){
            el.unbind('touchstart',modifiers);
            el.unbind('touchend',modifiers);
        }else{
            el.unbind('mousedown',modifiers);
            el.unbind('mouseup',modifiers);
        }
    }
};

init(vueTap);

vueTap.version = '__VERSION__';
if(inBrowser){//在浏览器中安装该插件
    vueTap.install = (vue) => {
        vue.directive('vueTap',vueTap);
    };
    Vue && Vue.use(vueTap);
}

export default vueTap;