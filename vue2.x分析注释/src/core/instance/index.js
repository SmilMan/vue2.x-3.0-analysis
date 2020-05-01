import {
  initMixin
} from './init'
import {
  stateMixin
} from './state'
import {
  renderMixin
} from './render'
import {
  eventsMixin
} from './events'
import {
  lifecycleMixin
} from './lifecycle'
import {
  warn
} from '../util/index'

function Vue(options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)  // 当引入vue ，完成了所有的初始化，开始new Vue(option) --> 执行this._init()
}

initMixin(Vue)// 在Vue.prototype上挂载_init()函数，在_init里有很多初始化操作，并且执行两个生命周期：beforeCreate和create
stateMixin(Vue) //(原型上)Vue.prototype上挂载： 属性：$data  $props     方法:$set  $delete $watch   实例方法
eventsMixin(Vue)  // （原型上）Vue.prototype上挂载：$on  $once  $off $emit
lifecycleMixin(Vue)//（原型上）Vue.prototype上挂载：$_update   $forceUpdate   $destroy
renderMixin(Vue) // 挂载一些便利方法：installRenderHelpers(Vue.prototype)， 挂载：$nextTick  _render

export default Vue
