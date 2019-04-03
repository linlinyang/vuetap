const path = require('path');
const resolve = _path => path.resolve(__dirname,'../',_path);
const {input,output} = require('./config')[0];

//module.export = Object.assign({},input,{output});

export default {
    input: resolve('src/index.js'),
    output: [{
        file: resolve('dist/bundle.js'),
        format: 'umd'
    }]
};