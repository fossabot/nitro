// @flow
import { Events } from '../../nitro.sdk'
import { vars } from '../styles.js'

const idleCallback = (fn: () => mixed) => {
  // currently just setting timeout to 350
  setTimeout(() => {
    requestAnimationFrame(fn)
  }, 350)
}

class _tasksExpanded extends Events {
  constructor(props) {
    super(props)
    this.state = {
      taskTriggerInProgress: false,
      list: null,
      task: null,
      position: 0
    }
    this.go = () => {
      console.log('history not working.')
    }
  }
  setGo(fn) {
    this.go = fn
  }
  routeUpdate(routeProps: object) {
    if (this.state.taskTriggerInProgress) {
      return
    }
    const params = routeProps.match.params
    if (typeof params.list !== 'undefined') {
      if (typeof params.task !== 'undefined') {
        if (
          this.state.list === params.list &&
          this.state.task === params.task
        ) {
          return // do nothing, it's already been triggered.
        }
        this.state.list = params.list
        this.state.task = params.task
        this.trigger('show', params.list, params.task)
      } else {
        if (this.state.task === null) {
          return
        }
        this.state.list = params.list
        this.state.task = null
        this.trigger('hide', params.list)
      }
    }
  }
  triggerTask(list: string, task: string, position: number) {
    if (this.state.list === list && this.state.task === task) {
      return
    }
    this.state.taskTriggerInProgress = true
    this.state.list = list
    this.state.task = task
    this.state.position = position
    this.trigger('show', list, task)

    idleCallback(() => {
      this.state.taskTriggerInProgress = false
      const url = `/${list}/${task}`
      this.go(url)
    })
  }
  triggerTaskHeight(height: number) {
    // TODO: Magic Numbers!
    const actualHeight = height * vars.notesLineHeight + 120
    this.trigger('height', actualHeight)
  }
}
export const TasksExpandedService = new _tasksExpanded()
