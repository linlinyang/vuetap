const _toString = Object.prototype.toString;

/* 
 * 判断对象是不是严格对象
*/
function isPlainObject(obj){
    return _toString.call(obj) === '[object Object]';
}

/*
 * 字符串转驼峰 
*/
function camelize(str){
    return str.replace(/-(\w)/g,($0,$1)=>{
        return $1.toUpperCase();
    });
}

export {
    isPlainObject,
    camelize
};