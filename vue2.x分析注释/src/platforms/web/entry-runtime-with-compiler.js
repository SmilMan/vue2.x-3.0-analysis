/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
//cached在share/util里面
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)
  //el --> <div id= "#app"> </app>

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  //解析模板和el,转换成render函数

  // 刚分析的思路就错啦，if(){}else if(){}else{}，关于esle if的语法真是不够了解。

  // 如果 Vue 选项中包含渲染函数，该模板将被忽略。直接进行mount.call(this, el, hydration)
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          // 如果值以 # 开始，则它将被用作选择符，并使用匹配元素的 innerHTML 作为模板
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
      // template =>  <div id ="#app">.....</div>
    }

    // 当配置了没有el, 此时比如template: "<div>hello </div>"
    // 手动去挂载：vm.$mount("#app")

    //如果有el, 没有template；则template = getOuterHTML(el)， 将包含挂载的元素以及里面的内容一起获取。

    
    //若有el，也有template，则if(template){} else if(el){} , template会作为编译的模板，覆盖挂载元素里的东西，除非提供插槽。


    //若没有template的话，
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,  //  布尔值  是否应该解码换行符  IE 
        shouldDecodeNewlinesForHref,//布尔值  是否应该解码换行符 在a[href]属性里， chrome  
        delimiters: options.delimiters, //限制，是否限制模板的编译形式：默认{{}}双大括号
        
        comments: options.comments //是否保留模板中的注释，为true时，就是保留，默认为舍弃注释
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue

// 修正$mount
// Vue.compile