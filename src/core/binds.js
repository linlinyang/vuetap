/* /src/core/index.js */
import { isPlainObject, camelize } from '../utils/helper';
import { touchSupport } from '../utils/dom';

let startX = 0,
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
function createTouchStart(modifiers){
    return function(event){
        let e = event.touches
                    ? event.touches[0]
                    : event;
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
function createTouchEnd(binding,modifiers,directiveName){
    return function(event){
        let e = event.changedTouches
                    ? event.changedTouches[0]
                    : event;
        const diffX = e.clientX - startX;
        const diffY = e.clientY - startY;
        const diffTime = new Date() - starttime;
        const targetEl = event.target || event.srcElement;
        const handlerObj = binding.value;
        
        if(modifiers.stop){
            event.stopPropagation();
        }
        if(modifiers.prevent){
            event.preventDefault();
        }
        
        const getHandler = parseHandler(directiveName,handlerObj);
        let handler = null;
        if(diffTime < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10){//执行点击事件，如果已绑定
            handler = getHandler('tap');
        }else{
            if(Math.abs(diffX) > Math.abs(diffY)){//水平方向
                if(diffX > 30){//执行右滑事件，如果已绑定
                    handler = getHandler('swiperRight');
                }else if(diffX < -30){//执行左滑事件，如果已绑定
                    handler = getHandler('swiperLeft');
                }
            }else{//垂直方向
                if(diffY > 30){//执行下滑事件，如果已绑定
                    handler = getHandler('swiperDown');
                }else{//执行上滑事件，如果已绑定
                    handler = getHandler('swiperUp');
                }
            }
        }
        
        if(
            (
                modifiers.self 
                && oldTargetEl === targetEl 
                && event.currentTarget === targetEl
            ) 
            || !modifiers.self
        ){//执行回调函数
            if(handler && typeof handler === 'function'){
                handler.call(targetEl,event,binding.arg);
                if(modifiers.once){//只执行一次则释放指令
                    if(touchSupport){
                        targetEl.unbind('touchstart',modifiers);
                        targetEl.unbind('touchend',modifiers)
                    }else{
                        targetEl.unbind('mousedown',modifiers)
                        targetEl.unbind('mouseup',modifiers)
                    }
                }
            }
        }
    }
}

/* 
 * 解析指令绑定的值，返回获取根据指令属性返回回调函数的函数
 *
 * @params {directiveName} String;绑定的指令名称
 * @params {handlerObj} Function | Object;对调对象
 * 
 * @return Function;返回获取回调函数的函数
*/
function parseHandler(directiveName,handlerObj){
    directiveName = camelize(directiveName);
    return function(propName){
        if(typeof handlerObj === 'function'){
            return directiveName === propName || (directiveName === 'vueTap' && propName === 'tap')
                ? handlerObj
                : null;
        }
        if(isPlainObject(handlerObj)){
            return typeof handlerObj[propName] === 'function'
                ? handlerObj[propName]
                : null;
        }
    }
}

export {
    createTouchStart,
    createTouchEnd
};