/* flow */
/* eslint-env jasmine */
'use strict'

import { checkAuth } from '../../../core/auth'
import {
  updateTask,
  updateTaskOnClient,
  changeTaskStatus
} from '..'
import {
  uploadTask,
  createTaskOnClient
} from '../../create'
import {
  deleteTaskOnClient
} from '../../delete'
import {
  taskStore,
  employeeStore
} from '../../store'

describe('task update', () => {
  let sampleTask = {
    id: -1,
    name: 'test-task',
    description: 'test-task description',
    status: 'NEW',
    dueTime: 0,
    section: 'Meat section'
  }

  beforeAll(() => {
    sessionStorage.setItem('username', 'pekka')
  })

  beforeEach(() => {
    createTaskOnClient(sampleTask)
  })

  afterEach(() => {
    deleteTaskOnClient(sampleTask.id)
  })

  describe('task details update', () => {
    it('updates task assignees', () => {

    })

    it('updates task name', () => {
      updateTaskOnClient({
        ...sampleTask,
        name: 'another name'
      })

      expect(taskStore.getById(sampleTask.id).name)
        .toEqual('another name')
    })

    it('updates task description', () => {
      updateTaskOnClient({
        ...sampleTask,
        description: 'another description'
      })

      expect(taskStore.getById(sampleTask.id).description)
        .toEqual('another description')
    })

    it('updates dueTime', () => {
      updateTaskOnClient({
        ...sampleTask,
        dueTime: 5
      })

      expect(taskStore.getById(sampleTask.id).dueTime)
        .toEqual(5)
    })

    it('updates task location', () => {
      updateTaskOnClient({
        ...sampleTask,
        section: 'Dairy section'
      })

      expect(taskStore.getById(sampleTask.id).section)
        .toEqual('Dairy section')
    })
  })

  describe('task status update', () => {
    it('marks task as in progress', () => {
      updateTaskOnClient({
        ...sampleTask,
        status: 'doing'
      })

      expect(taskStore.getById(sampleTask.id).status)
        .toEqual('doing')
    })

    it('marks task as in done', () => {
      updateTaskOnClient({
        ...sampleTask,
        status: 'done'
      })

      expect(taskStore.getById(sampleTask.id).status)
        .toEqual('done')
    })

    it('reverts task from inProgress to new', () => {
      updateTaskOnClient({
        ...sampleTask,
        status: 'doing'
      })
      expect(taskStore.getById(sampleTask.id).status)
        .toEqual('doing')

      updateTaskOnClient({
        ...sampleTask,
        status: 'new'
      })
      expect(taskStore.getById(sampleTask.id).status)
        .toEqual('new')
    })

    it('reverts task from done to new', () => {
      updateTaskOnClient({
        ...sampleTask,
        status: 'done'
      })
      expect(taskStore.getById(sampleTask.id).status)
        .toEqual('done')

      updateTaskOnClient({
        ...sampleTask,
        status: 'new'
      })
      expect(taskStore.getById(sampleTask.id).status)
        .toEqual('new')
    })
  })

  describe('task kind update (appeal/non-appeal)', () => {
    it('accepts an appeal turning it to ordinary task', () => {
      updateTaskOnClient({
        ...sampleTask,
        appeal: 'true'
      })
      expect(taskStore.getById(sampleTask.id).appeal)
        .toEqual('true')

      updateTaskOnClient({
        ...sampleTask,
        appeal: 'false'
      })
      expect(taskStore.getById(sampleTask.id).appeal)
        .toEqual('false')
    })
  })
})
