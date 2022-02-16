class ReactiveEffect {
  private _fn: any
  constructor (fn: any) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new WeakMap()
export function track (target: object, key: string) {
  // target -> key -> dep
  let depsMap= targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep: Set<any> | undefined = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
}

let activeEffect: ReactiveEffect | null = null
export function effect (fn: () => any) {
  // fn
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}
