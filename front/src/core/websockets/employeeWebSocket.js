/* flow */
'use strict'

import { List } from 'immutable'

import {
  updateEmployeeOnClient
} from '../../controller/update'
import {
  notify
} from '../notifications'
import {
  employeeStore
} from '../../controller/store'
import {
  getUsername,
  getCreatedTasks
} from '../auth'
import { loadEmployees } from '../../controller/main'

export function initWebSocket () {
  let wsUri = "ws://localhost:8080/back/employeesSocket/7"
  let websocket = new WebSocket(wsUri)

  websocket.onmessage = function(evt) { onMessage(evt) }
  websocket.onerror = function(evt) { onError(evt) }
  websocket.onopen = function(evt) { onOpen(evt) }
}

function onMessage (evt) {
  let notification = JSON.parse(evt.data)

  if (typeof notification.object != 'string' && !notification.object.username) {
    return
  }

  console.log(notification)
  switch (notification.pushType) {
    case 'CREATE':
      // logic for employee creation here
      break

    // a new task has been asigned to the employee
    case 'UPDATE':
      notification.object.tasks = List(notification.object.tasks)
      notification.object.createdTasks = List(notification.object.createdTasks)

      let preupdatedEmployee = employeeStore.getEmployeeByUsername(getUsername())
      let preupdatedTaskIds = preupdatedEmployee
        .tasks.map((t) => t.id)

      updateEmployeeOnClient({
        ...notification.object
      })

      let newTasks = notification.object.tasks
        .filter((t) => !preupdatedTaskIds.includes(t.id) &&
          notification.initiator.username !== getUsername() && !t.urgent)

      if (newTasks) {
        newTasks.forEach((t) => {
          notify({
            type: 'CREATE',
            body: t,
            initiator: notification.initiator
          })
        })
      }
      break

    case 'DELETE':
      // logic for employee deletion here
      break

    default:
      console.log('unknown notification type')
  }
}

function onError (evt) {
  console.log('socket error occured')
}

function onOpen () {
  console.log('socket connection is open')
}
