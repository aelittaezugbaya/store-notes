/* flow */
/* eslint-env jasmine */
'use strict'

import { List } from 'immutable'

import {
  taskStore,
  employeeStore
} from '../../store'
import {
  createTaskOnClient
} from '..'

describe('create task', () => {
  const noop = () => null

  const failCase = (done) => {
    fail()
    done()
  }

  beforeEach(() => {
    spyOn(taskStore, 'addTask')
    spyOn(employeeStore, 'deleteEmployee')
    spyOn(employeeStore, 'addEmployee')
  })

  describe('task creation by workers', () => {
    beforeAll(() => {
      sessionStorage.setItem('username', 'pekka')
      sessionStorage.setItem('password', '123456')
    })

    it('creates a simple task', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW'
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })

    it('creates a task with assignees', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW',
        employees: List.of({
          username: 'pekka',
          name: 'pekka',
          rank: 'WORKER'
        })
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })

    it('creates a task appeal', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW',
        isAppeal: true
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })

    it('creates an urgent task', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW',
        isUrgent: true
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })
  })

  describe('task creation by managers', () => {
    beforeAll(() => {
      sessionStorage.setItem('username', 'anna')
      sessionStorage.setItem('password', '123456')
    })

    it('creates a simple task', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW'
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })

    it('creates a task with assignees', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW',
        employees: List.of({
          username: 'pekka',
          name: 'pekka',
          rank: 'WORKER'
        })
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })

    it('creates a task appeal', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW',
        isAppeal: true
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })

    it('creates an urgent task', () => {
      createTaskOnClient({
        name: 'test-tast',
        description: 'test-tast-description',
        status: 'NEW',
        isUrgent: true
      })

      expect(taskStore.addTask).toHaveBeenCalled()
    })
  })
})
