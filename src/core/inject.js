/* /src/core/inject.js */

const swiperTypes = ['tap','swiperLeft','swiperRight','swiperDown','swiperUp'];

function inject(vueTap){
    let len = swiperTypes.length;

    while(len--){
        vueTap[swiperTypes[len]] = {
            bind: vueTap.bind.bind(swiperTypes[len]),
            componentUpdated: vueTap.bind.bind(swiperTypes[len]),
            unbind: vueTap.unbind
        };
    }
}


export default inject;