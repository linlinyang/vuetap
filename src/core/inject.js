/* /src/core/inject.js */

const swiperTypes = ['swiperLeft','swiperRight','swiperDown','swiperUp'];

function inject(vueTap){
    let len = swiperTypes.length;

    while(len--){
        vueTap[swiperTypes[len]] = {
            bind: vueTap.bind,
            componentUpdated: vueTap,
            unbind: vueTap.unbind
        };
    }
}


export default inject;