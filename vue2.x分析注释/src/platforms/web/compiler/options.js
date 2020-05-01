/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,// [klass: {staticKeys, transformNode,genData}, style:{staticKeys, transformNode,genData}, model: {{staticKeys, transformNode,genData}}]
  directives, // {model: function model(){}, text:function text() {}, html: function html(){}}
  isPreTag,  // const isPreTag = (tag: ?string): boolean => tag === 'pre'
  isUnaryTag, //
  mustUseProp,// ..
  canBeLeftOpenTag, //...
  isReservedTag, // const isReservedAttr = makeMap('style,class')  Reserved保留
  getTagNamespace, //...
  staticKeys: genStaticKeys(modules)
}
