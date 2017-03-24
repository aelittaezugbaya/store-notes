/* flow */
/* eslint-env jasmine */
'use strict'

import { List } from 'immutable'

import {
  getEmployees,
  createTask,
  updateTask,
  deleteTask
} from '../../ajax'
import { checkAuth } from '../../auth'
import * as notificationFunctions from '..'
import {
  initWebSocket as startTaskWebSocket
} from '../../websockets/taskWebSocket'
import {
  initWebSocket as startEmployeeWebSocket
} from '../../websockets/employeeWebSocket'
import {
  populateEmployeeStore
} from '../../../controller/main'
import {
  appStore,
  taskStore
} from '../../../controller/store'

describe('desktop notifications', () => {
  beforeAll(() => {
    sessionStorage.setItem('username', 'pekka')
  })

  beforeEach(() => {
    spyOn(appStore, 'triggerNotifLogic')
  })

  afterEach(() => {
    taskStore.deleteAllTasks()
  })

  describe('main notification logic', () => {
    it('does not send a notification to the action initiator', () => {
      notificationFunctions.processNotifications(
        {
          type: 'CREATE',
          body: {
            id: 1,
            name: 'test-task',
            description: 'test-task description',
            status: 'NEW',
          },
          initiator: {
            username: 'pekka'
          }
        },
        List.of(1),
        List.of(1)
      )

      expect(appStore.triggerNotifLogic)
        .not.toHaveBeenCalled()
    })
  })

  describe('CREATE type notifications', () => {
    it('sends notification when a task is assigned to a person', () => {
      notificationFunctions.processNotifications(
        {
          type: 'CREATE',
          body: {
            id: 1,
            name: 'test-task',
            description: 'test-task description',
            status: 'NEW',
          },
          initiator: {
            username: 'anna'
          }
        },
        List(),
        List.of(1)
      )

      expect(appStore.triggerNotifLogic)
        .toHaveBeenCalled()
    })

    it('sends notification when a task is urgent', () => {
      notificationFunctions.processNotifications(
        {
          type: 'CREATE',
          body: {
            id: 1,
            name: 'test-task',
            description: 'test-task description',
            status: 'NEW',
            urgent: true
          },
          initiator: {
            username: 'anna'
          }
        },
        List(),
        List()
      )

      expect(appStore.triggerNotifLogic)
        .toHaveBeenCalled()
    })
  })

  describe('UPDATE type notifications', () => {
    it('sends notification when one\'s appeal was accepted', () => {
      taskStore.addTask({
        id: 1,
        name: 'test-task',
        description: 'test-task description',
        status: 'NEW',
        appeal: true
      })

      notificationFunctions.processNotifications(
        {
          type: 'UPDATE',
          body: {
            id: 1,
            name: 'test-task',
            description: 'test-task description',
            status: 'NEW',
            appeal: false
          },
          initiator: {
            username: 'anna'
          }
        },
        List.of(1),
        List()
      )

      expect(appStore.triggerNotifLogic)
        .toHaveBeenCalled()
    })
  })

  describe('DELETE type notifications', () => {
    it('sends notification when one\'s appeal was rejected', () => {
      taskStore.addTask({
        id: 1,
        name: 'test-task',
        description: 'test-task description',
        status: 'NEW',
        appeal: true
      })

      notificationFunctions.processNotifications(
        {
          type: 'DELETE',
          body: 1,
          initiator: {
            username: 'anna'
          }
        },
        List.of(1),
        List()
      )

      expect(appStore.triggerNotifLogic)
        .toHaveBeenCalled()
    })
  })
})
