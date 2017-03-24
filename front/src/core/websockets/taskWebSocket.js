/* flow */
'use strict'

import {
  createTaskOnClient
} from '../../controller/create'
import {
  deleteTaskOnClient
} from '../../controller/delete'
import {
  updateTaskOnClient
} from '../../controller/update'
import {
  notify
} from '../notifications'

export function initWebSocket () {
  let wsUri = "ws://localhost:8080/back/tasksSocket/5"
  let websocket = new WebSocket(wsUri)

  websocket.onmessage = function(evt) { onMessage(evt) }
  websocket.onerror = function(evt) { onError(evt) }
  websocket.onopen = function(evt) { onOpen(evt) }
}

function onMessage (evt) {
  let notification = JSON.parse(evt.data)

  if (typeof notification.object != 'number' && !notification.object.id) {
    return
  }

  console.log(notification)
  switch (notification.pushType) {
    case 'CREATE':
      createTaskOnClient({
        ...notification.object,
        status: notification.object.status.toLowerCase()
      })
      notify({
        type: 'CREATE',
        body: notification.object,
        initiator: notification.initiator
      })
      break

    case 'UPDATE':
      notify({
        type: 'UPDATE',
        body: notification.object,
        initiator: notification.initiator
      })
      updateTaskOnClient({
        ...notification.object,
        status: notification.object.status.toLowerCase()
      })
      break

    case 'DELETE':
      notify({
        type: 'DELETE',
        body: notification.object,
        initiator: notification.initiator
      })
      deleteTaskOnClient(notification.object)
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
