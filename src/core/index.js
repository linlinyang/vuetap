/* /src/core/init.js */
import { createTouchStart,createTouchEnd } from './binds';
import {touchSupport} from '../utils/dom';

/* 
 * 为对应的指令绑定对应的事件
 *
 * @params {directiveName} String;指令名称，只能是['vueTap',tap','swiperLeft','swiperRight','swiperDown','swiperUp']其中的一种
 * @params {el} Dom Object;指令绑定的元素
 * @params {binding} Object;Vue指令传入的binding对象，详情查看https://cn.vuejs.org/v2/guide/custom-directive.html
 * 
*/
function bindFunc(directiveName,el,binding){
    const modifiers = binding.modifiers;
    if(touchSupport){
        el.bind('touchstart',createTouchStart(modifiers),modifiers);
        el.bind('touchend',createTouchEnd(binding,modifiers,directiveName),modifiers);
    }else{
        el.bind('mousedown',createTouchStart(modifiers),modifiers);
        el.bind('mouseup',createTouchEnd(binding,modifiers,directiveName),modifiers);
    }
};

const directTypes = ['tap','swiperLeft','swiperRight','swiperDown','swiperUp'];//vueTap可以使用的指令属性名称

/* 
* 初始化vueTap，为vueTap对象添加指令属性
*/
function init(vueTap){
    let len = directTypes.length;

    while(len--){//为vueTap对象添加指令属性
        vueTap[directTypes[len]] = {
            bind: bindFunc.bind(null,directTypes[len]),
            componentUpdated: bindFunc.bind(null,directTypes[len]),
            unbind: vueTap.unbind
        };
    }

    //默认指令——vueTap
    vueTap.bind = bindFunc.bind(null,'vueTap');
    vueTap.componentUpdated = bindFunc.bind(null,'vueTap');
}

export default init;