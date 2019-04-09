<p align='center'>
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/vue-tap-directive.svg">
<img alt="npm" src="https://img.shields.io/npm/v/vue-tap-directive.svg">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/linlinyang/vueTap.svg">
</p>
## vue-tap-directive ##


**vue-tap-derective** 是一款vue指令插件，安装后可以使用tap、左滑、右滑、上滑和下滑指令。vue事件修饰符均可在该指令中使用，指令参数在回调函数中可获取<br>
**vue-tap-derective** is a plugin for vue directive;We can use tap,swiper left,swiper right,swiper up and swiper down directive after installed.And we can use all directive modifiers similar as vue,the params of this directive can get in callback handler.

## 浏览器兼容/Browser Compatibility ##

**vue-tap-derective** 和vuejs兼容性类似。<br>
**vue-tap-derective** Browser Compatibility similar as vuejs.

## 安装/Install ##

**CDN**

    <script type="text/javascript" src="./dist/vueTap.min.js"></script>

**NPM**

    npm i -D vue-tap-directive

## 示例/Example ##

**示例一：绑定全部 / Example 1： bind all directive**

	<script src="https://vuejs.org/js/vue.min.js"></script>
	<div class="box" id='box1' v-vue-tap:args.stop.once='{
           tap: tapHandler,
           swiperLeft: swiperLeftHandler,
           swiperRight: swiperRightHandler,
           swiperUp: swiperUpHandler,
           swiperDown: swiperDownHandler
       }'>
	</div>
	<script src="../dist/vueTap.js"></script>
	<script>
		var box1 = new Vue({
            el: '#box1',
            methods: {
                tapHandler: function(e,args){
                    console.log('点击/tap');
                },
                swiperLeftHandler: function(e,args){
                    console.log('左滑/swiper left');
                },
                swiperRightHandler: function(e,args){
                    console.log('右滑/swiper right');
                },
                swiperUpHandler: function(e,args){
                    console.log('上滑/swiper up');
                },
                swiperDownHandler: function(e,args){
                    console.log('下滑/swiper down');
                }
            }
        })
	</script>

**示例二：默认绑定 / Example 2： bind by defualt**

	<script src="https://vuejs.org/js/vue.min.js"></script>
	<div class="box" id='box2' v-vue-tap:foo.stop.once='clickHandler'>
       <div class="tips">
           <span>默认绑定点击事件 / Bind tap event by default</span>
       </div>
	</div>
	<script src="../dist/vueTap.js"></script>
	<script>
		var box2 = new Vue({
            el: '#box2',
            methods: {
                clickHandler: function(e,foo){
                    alert('点击/tap');
                }
            }
        });
	</script>

**示例三：自定义指令名绑定 / Custom directive name when bind**

	<script src="https://vuejs.org/js/vue.min.js"></script>
	<div class="box" id="box3" v-touch-right='swiperRightHandler' v-foo-left='swiperLeftHandler' v-custom-up='swiperUpHandler' v-self-down='swiperDownHandler'>
        <div class="tips">
            <span>自定义指令名时使用vuetap的swiperRight属性，自定义指令驼峰命名使用指令时请转换成v-逆驼峰格式</span><br><br>
        </div>
	</div>
	<script src="../dist/vueTap.js"></script>
	<script>
		var box3 = new Vue({
            el: '#box3',
            directives: {
				tap: vueTap.tap,
                touchRight: vueTap.swiperRight,
				fooLeft: vueTap.swiperLeft,
				customUp: vueTap.swiperUp,
				selfDown: vueTap.swiperDown
            },
            methods: {
                tap: function(){
                    console.log('组件内自定义指令名-tap，点击 / Custom directive name - tap in component,tap directive');
                },
                swiperRightHandler: function(){
                    console.log('组件内自定义指令名-touchRight，右滑 / Custom directive name - touchRight in component,swiper right directive');
                },
                swiperLeftHandler: function(){
                    console.log('组件内自定义指令名-fooLeft，左滑 / Custom directive name - fooLeft in component,swiper right directive');
                },
                swiperUpHandler: function(){
                    console.log('组件内自定义指令名-customUp，右滑 / Custom directive name - customUp in component,swiper right directive');
                },
                swiperDownHandler: function(){
                    console.log('组件内自定义指令名-selfDown，右滑 / Custom directive name - selfDown in component,swiper right directive');
                }
            }
        });
	</script>

## 补充/supplement ##
> 使用vueTap定义的指令为同一个元素绑定相同指令及修饰符时，只执行该指令最后绑定到该元素上的回调函数<br>
> The last directive pointing callback handler will be called when binding two or more directives defined by vueTap on an element only.

## 作者/Author ##

**杨林/Zoro Yang**
