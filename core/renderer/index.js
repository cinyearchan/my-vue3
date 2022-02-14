export function mountElement (vnode, container) {
  const { tag, props, children } = vnode
  const el = vnode.el = document.createElement(tag)

  if (props) {
    for (let key in props) {
      el.setAttribute(key, props[key])
    }
  }

  if (typeof children === 'string' || typeof children === 'number') {
    const textNode = document.createTextNode(children)
    el.append(textNode)
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      mountElement(child, el)
    })
  }

  container.append(el)
}

export function diff (n1, n2) {
  // tag 可能改变
  if(n1.tag !== n2.tag) {
    n1.el.replaceWith(document.createElement(n2.tag))
  } else {
    n2.el = n1.el
    // props 可能改变
    // new : { id: 'foo', class: 'bar' }
    // old : { id: 'foo', class: 'baz' }
    // 变化：增删改
    const { props: newProps } = n2
    const { props: oldProps } = n1

    if (newProps && oldProps) {
      Object.keys(newProps).forEach(key => {
        const oldValue = oldProps[key]
        const newValue = newProps[key]
        if (newValue !== oldValue) {
          n1.el.setAttribute(key, newValue)
        }
      })
    }

    if (oldProps) {
      Object.keys(oldProps).forEach(key => {
        const newValue = newProps[key]
        if (!newValue) {
          console.log('2')
          n1.el.removeAttribute(key)
        }
      })
    }
    
    // children 可能改变
    const { children: newChildren } = n2
    const { children: oldChildren } = n1
    
    if (typeof newChildren === 'string' || typeof newChildren === 'number') {
      if (typeof oldChildren === 'string' || typeof oldChildren === 'number') {
        if (newChildren !== oldChildren) {
          n2.el.textContent = newChildren
        }
      } else if (Array.isArray(oldChildren)) {
        n2.el.textContent = newChildren
      }
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren === 'string' || typeof oldChildren === 'number') {
        n2.el.innerText = ''
        mountElement(n2, n2.el)
      } else if (Array.isArray(oldChildren)) {
        // 暴力对比
        const length = Math.min(newChildren.length, oldChildren.length)

        // 处理公共的 vnode
        for (let i = 0; i < length; i++) {
          const vnode = newChildren[i]
          const oldVnode = oldChildren[i]
          diff(oldVnode, vnode)
        }

        if (newChildren.length > length) {
          // 创建节点
          for (let i = length; i < newChildren.length; i++) {
            const vnode = newChildren[i]
            mountElement(vnode, n2.el)
          }
        }

        if (oldChildren.length > length) {
          // 删除节点
          for (let i = length; i < oldChildren.length; i++) {
            const vnode = oldChildren[i]
            vnode.el.parent.removeChild(vnode.el)
          }
        }
      }
    }
  }
}
