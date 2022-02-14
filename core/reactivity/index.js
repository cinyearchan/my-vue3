let currentEffect
class Dep {
  constructor(value) {
    this.effects = new Set()
    this._value = value
  }

  get value () {
    this.depend()
    return this._value
  }

  set value (newValue) {
    this._value = newValue
    this.notice()
  }

  // 收集依赖
  depend () {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }
  // 通知依赖更新
  notice () {
    this.effects.forEach(effect => {
      effect()
    })
  }
}

export function effectWatch (effect) {
  // 收集依赖
  currentEffect = effect
  effect()
  currentEffect = null
}

// const dep = new Dep(10)
// let b

// effectWatch(() => {
//   b = dep.value + 10
//   console.log(b)
// })

// dep.value = 20

let targetMap = new Map()

function getDep (target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }

  return dep
}

// vue2
// vue3 proxy
export function reactive(raw) {
  return new Proxy(raw, {
    get (target, key) {
      const dep = getDep(target, key)

      dep.depend()

      return Reflect.get(target, key)
    },
    set (target, key, value) {
      const dep = getDep(target, key)
      const result = Reflect.set(target, key, value)
      dep.notice()
      return result
    }
  })
}

// const user = reactive({
//   age: 19
// })

// let double
// effectWatch(() => {
//   double = user.age
//   console.log(double)
// })

// user.age = 20
