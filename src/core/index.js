/* /src/core/index.js */

let startX = 0,
    startY = 0,
    starttime = 0,
    oldTargetEl = null;

function createTouchStart(modifiers){
    return function(event){
        let e = event.touches
                    ? event.touches[0]
                    : event;
        startX = e.clientX;
        startY = e.clientY;
        starttime = new Date();
        oldTargetEl = event.currentTarget;

        if(modifiers.stop){
            event.stopPropagation();
        }
        if(modifiers.prevent){
            event.preventDefault();
        }
    };
}

function createTouchEnd(binding,modifiers){
    return function(event){
        let e = event.touches
                    ? event.touches[0]
                    : event;
        const diffX = e.clientX - startX;
        const diffY = e.clientY - startY;
        const diffTime = new Date() - starttime;
        
        if(modifiers.stop){
            event.stopPropagation();
        }
        if(modifiers.prevent){
            event.preventDefault();
        }

        let handler;
        switch(binding.name){
            case 'vue-tap':
                if(diffTime < 300 && Math.abs(diffX) < 10 && Math.abs(diffY)){
                    handler = binding.value;
                }
                break;
            case 'swiper-left':
                break;
            case 'swiper-right':
                break;
            case 'swiper-up':
                break;
            case 'swiper-down':
                break;
        }
    }
}

export {
    createTouchStart,
    createTouchEnd
};