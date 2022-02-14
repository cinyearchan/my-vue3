import { effectWatch } from "./reactivity/index.js"
import { mountElement, diff } from "./renderer/index.js"

export function createApp (rootComponent) {
  return {
    mount (rootContainer) {
      const context = rootComponent.setup()

      let isMounted = false
      let oldVnode = null
      
      effectWatch(() => {
        if (!isMounted) {
          // init
          isMounted = true
          rootContainer.innerHTML = ''
          const vnode = rootComponent.render(context)

          mountElement(vnode, rootContainer)

          oldVnode = vnode
        } else {
          // update
          const vnode = rootComponent.render(context)

          diff(oldVnode, vnode)

          oldVnode = vnode
        }        
      })
    }
  }
}
