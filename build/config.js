const path = require('path');
const buble = require('rollup-plugin-buble');
const flow = require('rollup-plugin-flow-no-whitespace');
const cjs = require('rollup-plugin-commonjs');
const node = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const version = process.env.version || require('../package.json').version;
const banner = 
`
/*! 
 * vue-tap-directive v${version}
 * https://github.com/linlinyang/vuetap
 * 
 * (c) ${new Date().getFullYear()} Yang Lin
 */
`;

const resolve = _path => path.resolve(__dirname,'../',_path);

module.exports = [
    {
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
    }
].map((options) => {
    let config = {
        input: {
            input: resolve('src/index.js'),
            plugins: [
                flow(),
                node(),
                cjs(),
                replace({
                    __VERSION__: version
                }),
                buble()
            ]
        }
    };

    config.output = Object.assign(
        Object.create(null),
        options,
        {
            banner,
            name: 'vueTap'
        }
    );

    if(options.env){
        config.input.plugins.unshift(replace({
            'process.env.NODE_ENV': JSON.stringify(options.env)
        }));
    }
    
    return config;
});