/* flow */
/* eslint-env jasmine */
'use strict'

import {
  taskStore
} from '../../store'
import {
  deleteTaskOnClient
} from '..'
import {
  createTaskOnClient
} from '../../create'
import {
  getRole,
  getCreatedTasks,
  checkAuth,
  getUsername
} from '../../../core/auth'

describe('delete task', () => {
  const noop = () => null

  const failCase = (done) => {
    fail()
    done()
  }

  describe('delete task by worker', () => {
    beforeAll(() => {
      sessionStorage.setItem('username', 'pekka')
      sessionStorage.setItem('password', '123456')
      checkAuth()
    })

    it('deletes a task created by a worker themselves', () => {
      createTaskOnClient({
        id: -2,
        name: 'test-task',
        description: 'test-task description',
        status: 'NEW'
      }, false)

      let init = taskStore.getTasks().size
      deleteTaskOnClient(-2, false)
      expect(taskStore.getTasks().size).toEqual(init - 1)
    })
/*
    xit('does not delete a task created by another worker', () => {
      sessionStorage.setItem('username', 'anna')
      sessionStorage.setItem('password', '123456')
      checkAuth()

      createTaskOnClient({
        id: -2,
        name: 'test-task',
        description: 'test-task description',
        status: 'NEW'
      }, false)

      sessionStorage.setItem('username', 'pekka')
      sessionStorage.setItem('password', '123456')
      checkAuth()

      let init = taskStore.getTasks().size
      deleteTaskOnClient(-2, false)
      expect(taskStore.getTasks().size).toEqual(init)
    })
    */
  })

  describe('delete task by manager', () => {
    beforeAll(() => {
      sessionStorage.setItem('username', 'anna')
      sessionStorage.setItem('password', '123456')
      checkAuth()
    })

    it('deletes a task created by a manager themselves', () => {
      createTaskOnClient({
        id: -3,
        name: 'test-task',
        description: 'test-task description',
        status: 'NEW'
      }, false)
      let init = taskStore.getTasks().size

      deleteTaskOnClient(-3, false)
      expect(taskStore.getTasks().size).toEqual(init - 1)
    })

    it('deletes a task created by another user', () => {
      sessionStorage.setItem('username', 'maija')
      sessionStorage.setItem('password', '123456')
      checkAuth()

      createTaskOnClient({
        id: -4,
        name: 'test-task',
        description: 'test-task description',
        status: 'NEW'
      }, false)
      let init = taskStore.getTasks().size

      sessionStorage.setItem('username', 'anna')
      sessionStorage.setItem('password', '123456')
      checkAuth()

      deleteTaskOnClient(-4, false)
      expect(taskStore.getTasks().size).toEqual(init - 1)
    })

  })
})
