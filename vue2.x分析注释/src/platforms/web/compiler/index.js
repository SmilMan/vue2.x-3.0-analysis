/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

// createCompiler = createCompilerCreator(function baseCompile(){
//                                                         return{
//                                                             ast,
//                                                             render: code.render,
//                                                             staticRenderFns: code.staticRenderFns
//                                                         }
//                                                     })

// function createCompilerCreator(fn)  {
//     return function createCompiler(baseOptions){
//                 function compile() {
//                     // fn()   --> 转成ast树
//                     //.....
//                 }
//                 return {
//                     compile,
//                     compileToFunctions: createCompileToFunctionFn(compile)
//                 }
//             }
// }

export { compile, compileToFunctions }
