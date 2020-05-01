function reactive(obj) {



return createReactiveObject(
            target,
            rawToReactive, // ==> new WeakMap()
            reactiveToRaw,  //==> new WeakMap()
            mutableHandlers,
            mutableCollectionHandlers
        )
}


let mutableHandlers = {
    get(target: object, key: string | symbol, receiver: object) {
        // 数组

    },
    set,
    deleteProperty,
    has,
    ownKeys
}
 
let mutableCollectionHandlers = {
    get(s) {
        return function(target, key,receiver) {
            
            
            return Reflect.get( s || target, key, receiver)
        }
    }
}

const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])

function createReactiveObject(
    target,
    rawToReactive, // ==> new WeakMap()
    reactiveToRaw,  //==> new WeakMap()
    mutableHandlers,
    mutableCollectionHandlers
) {
  const handlers = collectionTypes.has(target.constructor)
    ? mutableCollectionHandlers
    : mutableHandlers

  observed = new Proxy(target, handlers)


  rawToReactive.set(target, observed)
  reactiveToRaw.set(observed, target)
  return observed
}


//存储{target->key->dep}连接的主WeakMap。

//从概念上讲，将依赖项看作Dep类更容易

//它维护一组订户，但我们只是将它们存储为

//减少内存开销的原始集。
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

//收集
function track () {
  let depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (dep === void 0) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}
//触发
function trigger() {
    const depsMap = targetMap.get(target)
    
}




function createReactiveEffect(fn, options) {
      const effect = function reactiveEffect(...args) {
          if (!effect.active) {
              return options.scheduler ? undefined : fn(...args);
          }
          if (!effectStack.includes(effect)) {
              cleanup(effect);
              try {
                  enableTracking();
                  effectStack.push(effect);
                  activeEffect = effect;
                  return fn(...args);
              }
              finally {
                  effectStack.pop();
                  resetTracking();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect._isEffect = true;
      effect.active = true;
      effect.raw = fn;
      effect.deps = [];
      effect.options = options;
      return effect;
  }



























































