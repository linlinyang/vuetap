const _toString = Object.prototype.toString;

function isPlainObject(obj){
    return _toString.call(obj) === '[object Object]';
}

export {
    isPlainObject
};