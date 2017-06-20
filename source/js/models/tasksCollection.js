import Events from './events.js'
import Task from './task.js'

// the main thing that holds all the tasks
export class tasks extends Events {
  constructor(props) {
    super(props)
    // two stores, one for current tasks, one for completed
    this.collection = new Map()
    this.completedcollection = new Map()
    this.loadLocal()
  }
  setSync(sync) {
    this.sync = sync
  }
  add(props) {
    // todo: collision detection
    let id = Math.round(Math.random() * 100000).toString()
    props.id = id
    this.collection.set(id, new Task(props))

    this.trigger('update', props.list)
    this.saveLocal()

    this.sync.post([props.list, id])
  }
  update(id, props, sync = true) {
    const resource = this.find(id, !sync)

    // not allowed to update the id
    Object.keys(props).forEach(function(key) {
      if (key !== 'id') resource[key] = props[key]
    })
    this.trigger('update')
    this.saveLocal()
    if (sync) this.sync.patch([resource.list, id])
    return resource
  }
  // maybe roll these into one function?
  addListFromServer(tasks, listId) {
    if (tasks.length < 1) return
    tasks.forEach(props => {
      // todo: collision detection
      let id = Math.round(Math.random() * 100000).toString()
      props.serverId = props.id
      props.lastSync = props.updatedAt
      props.id = id
      props.list = listId
      this.collection.set(id, new Task(props))
    })
    this.trigger('update', listId)
    this.saveLocal()
  }
  patchListFromServer(tasks, listId) {
    const findFromServer = function(serverId) {
      return function(item) {
        return item.serverId === serverId
      }
    }
    if (tasks.length < 1) return
    const currentTasks = this.findList(listId)
    tasks.forEach(props => {
      const task = currentTasks.find(findFromServer(props.id))
      task.name = props.name
      task.notes = props.notes
    })
    this.trigger('update', listId)
    this.saveLocal()
  }
  // this might be enhanced in the future to get task from server?
  find(id, serverId = false) {
    // ugh there's no find() method :|
    // or reduce method
    if (serverId) {
      let match = null
      this.collection.forEach(item => {
        if (item.serverId === id) {
          match = item
        }
      })
      return match
    }
    return this.collection.get(id) || null
  }
  findList(list, completed) {
    let returned = []
    if (list === 'all') {
      // return all tasks, ignore ids
      returned = Array.from(this.collection, function(item) {
        return item[1]
      })
    } else {
      // return the normal list
      this.collection.forEach(function(task) {
        if (task.list === list) {
          returned.push(task)
        }
      })
      if (list === 'today') {
        // + due today / overdue + priority
      } else if (list === 'next') {
        // + due at some point + priority
      }
    }
    return returned
  }
  findListCount(list, completed = true) {
    return this.findList(list, completed).length
  }
  deleteTasks(tasks) {
    this.collection.forEach((task, key) => {
      if (tasks.indexOf(task.id) !== -1) {
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  deleteAllFromList(list) {
    this.collection.forEach((task, key) => {
      if (task.list === list) {
        this.collection.delete(key)
      }
    })
    this.saveLocal()
  }
  saveLocal() {
    requestAnimationFrame(() => {
      let data = this.toObject()
      localStorage.setItem('nitro3-tasks', JSON.stringify(data[0]))
      localStorage.setItem('nitro3-tasks-completed', JSON.stringify(data[1]))
    })
  }
  loadLocal() {
    let data = localStorage.getItem('nitro3-tasks')
    let dataCompleted = localStorage.getItem('nitro3-tasks-completed')
    if (data === null) {
      this.createLocal()
      this.saveLocal()
      return
    }
    JSON.parse(data).forEach(item => {
      this.collection.set(item.id, new Task(item))
    })
    JSON.parse(dataCompleted).forEach(item => {
      this.collection.set(item.id, new Task(item))
    })
    console.log('Loaded Tasks from localStorage')
  }
  createLocal() {
    console.log('TODO: Create Default Tasks')
  }
  toObject() {
    // TODO: when this is patched to have an order
    // update this to use these in order
    let result = []
    let resultCompleted = []
    this.collection.forEach(function(value, key) {
      result.push(value.toObject())
    })
    this.completedcollection.forEach(function(value, key) {
      resultCompleted.push(value.toObject())
    })
    return [result, resultCompleted]
  }
}
export let TasksCollection = new tasks()