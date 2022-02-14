import { reactive } from './core/reactivity/index.js'
import { h } from './core/h.js'

const App = {
  render (context) {
    // effectWatch(() => {
    //   document.body.innerText = ``

    //   const div = document.createElement('div')
    //   div.innerText = context.state.count

    //   document.body.append(div)
    // })
    // const div = document.createElement('div')
    // div.innerText = context.state.count
    // return div

    return h ('div', {
      id: `app - ${context.state.count}`,
      class: 'showTime'
    }, context.state.count)
  },
  setup () {
    const state = reactive({
      count: 0
    })
    window.state = state
    return { state }
  }
}

export default App
