/* /src/utils/equal.js */

import {isPlainObject} from './helper';

/*
 * 检查两个对象是否相等，只检查自身属性，不检查隐式原型
 * 
 * @params{objA} Object
 * @params{objB} Object
 * @params{strict} Boolean;是否严格相等
*/

function equal(objA,objB,strict){
    if(!isPlainObject(objA) || !isPlainObject(objB)){
        return false;
    }

    let keysA = Object.keys(objA),
        keysB = Object.keys(objB);

    if(keysA.length !== keysB.length){
        return false;
    }

    let len = keysA.length,
        ret = true;
    while(len--){
        let tempKey = keysA[len],
            valA = objA[tempKey],
            valB = objB[tempKey];
        if(isPlainObject(valA) || isPlainObject(valB)){
            if(valA === objB || valB === objA || valA === objA || valB === objB){//是否循环引用
                continue;
            }else{
                ret && equal(valA,valB);
            }
        }else{
            if(strict){
                ret && (valA === valB);
            }else{
                ret && (valA == valB);
            }
        }
    }
    
    return ret;
}

export default equal;