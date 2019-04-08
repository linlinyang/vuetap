/* /build/build.js */
import buble from 'rollup-plugin-buble';//在rollup.js打包的过程中进行代码编译，将ES6+代码编译成ES2015标准
import flow from 'rollup-plugin-flow-no-whitespace';//去除flow静态类型检查代码
import commonjs from 'rollup-plugin-commonjs';//这两个插件可以让你加载Node.js里面的CommonJS模块
import node from 'rollup-plugin-node-resolve';//这两个插件可以让你加载Node.js里面的CommonJS模块
import babel from 'rollup-plugin-babel';//打包的时候使用Babel
import {uglify} from 'rollup-plugin-uglify';//压缩、美化js文件
import replace from 'rollup-plugin-replace';

const path = require('path');
const resolve = _path => path.resolve(__dirname,'../',_path);
const version = process.env.VERSION || require('../package.json').version;
const banner = 
`/* !
  * vueTap v${version}
  * https://github.com/linlinyang/vuetap
  * 
  * (c) ${new Date().getFullYear()} Yang Lin
  */
`;

const outputs = [{
    file: resolve('dist/vueTap.js'),
    format: 'umd',
    env: 'development'
},{
    file: resolve('dist/vueTap.min.js'),
    format: 'umd',
    env: 'production'
},{
    file: resolve('dist/vueTap.common.js'),
    format: 'cjs'
},{
    file: resolve('dist/vueTap.esm.js'),
    format: 'es'
}];

function buildRollupConfig(output){
    let config = {
        input: resolve('src/index.js'),
        plugins: [
            flow(),
            node(),
            commonjs(),
            buble(),
            replace({
                __VERSION__: version
            }),
            babel({
                extensions: [".js"],
                runtimeHelpers: true,
                exclude: ["node_modules/**"]
            })
        ],
        output: {
            file: output.file,
            format: output.format,
            banner,
            name: 'vueTap'
        }
    };

    if(output.env && output.env.includes('prod')){
        config.plugins.push(uglify());
    }

    return config;
}

export default outputs.map(buildRollupConfig);

