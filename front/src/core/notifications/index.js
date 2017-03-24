/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import {
  getUsername,
  getCreatedTasks
} from '../auth'
import {
  employeeStore,
  taskStore,
  appStore
} from '../../controller/store'
import {
  displayDetails
} from '../../views/main/details'
import {
  handlePermissions
} from '../../controller/details'

import type { Notif } from '../../types'

export function notify(
  recievedNotif: Notif
) {
  // $FlowIgnore
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  } else {
    let createdTaskIds = getCreatedTasks().map((t) => t.id)
    let assignedTaskIds = employeeStore
      .getEmployeeByUsername(getUsername())
      .tasks.map((t) => t.id)

    processNotifications(
      recievedNotif,
      createdTaskIds,
      assignedTaskIds
    )
  }
}

export function processNotifications (
  recievedNotif: Notif,
  createdTaskIds: List<number>,
  assignedTaskIds: List<number>
) {
  // if the initiator of the action is the user themselves, don't send a notification
  if (recievedNotif.initiator.username === getUsername()) {
    return
  }

  let task
  let notification

  switch (recievedNotif.type) {
    case 'CREATE':
      task = recievedNotif.body

      if (assignedTaskIds.includes(task.id)) {
        emitNotification(
          'There is a new task!',
          'A task called \"' + task.name + '\" has just been assigned to you!' +
            'Click here to see more',
          task
        )
      } else if (task.urgent) {
        emitNotification(
          'There is a new URGENT task!',
          'A task called \"' + task.name + '\" has just been created!' +
            'Click here to see more',
          task
        )
      }
      break

    case 'UPDATE':
      task = recievedNotif.body
      let preAcceptedAppealTask = taskStore.getById(task.id)


      if (createdTaskIds.includes(task.id) && preAcceptedAppealTask &&
          preAcceptedAppealTask.appeal && !task.appeal) {
        emitNotification(
          'Your appeal was accepted!',
          'An appeal called \"' + task.name + '\" has just been accepted!' +
            'Click here to see more',
          task
        )
      }
      break

    case 'DELETE':
      let id = recievedNotif.body
      let preRejectedTask = taskStore.getById(id)

      if (createdTaskIds.includes(id) && preRejectedTask &&
          preRejectedTask.appeal) {
        emitNotification(
          'Your appeal was rejected!',
          'An appeal that you created has just been rejected!' +
            'Click here to see more',
          task
        )
      }
      break
  }
}

export function emitNotification (
  header: string,
  body: string,
  task: any
) {
  // $FlowIgnore
  let notification = new Notification(header, {
    icon: '../../../public/img/lidl.png',
    body: body,
  })

  notification.onclick = function (ev) {
    ev.preventDefault()

    // window.open('http://localhost:8081')

    displayDetails(task)
    handlePermissions(task)
    $('#taskDetails').modal('show')
  }

  appStore.triggerNotifLogic()
}
