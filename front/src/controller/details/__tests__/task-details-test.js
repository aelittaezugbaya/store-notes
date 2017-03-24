/* flow */
/* eslint-env jasmine */
'use strict'

import $ from 'jquery'

import {
  displayDetails
} from '../../../views/main/details'
import {
  displayCreateEditComponent
} from '../../../views/main/create'
import {
  createTaskComponent,
  createCompletedTaskComponent,
  createMainViewComponent
} from '../../../views/main'
import {
  handlePermissions
} from '..'
import { checkAuth } from '../../../core/auth'
import { loadEmployees } from '../../main'

describe('details view display logic', () => {
  const noop = () => null

  const setManagerRole = (callback?: any = noop) => {
    sessionStorage.setItem('username', 'anna')
    sessionStorage.setItem('password', '123456')
    checkAuth(callback)
  }

  const setWorkerRole = (callback?: any = noop) => {
    sessionStorage.setItem('username', 'pekka')
    sessionStorage.setItem('password', '123456')
    checkAuth(callback)
  }

  beforeAll(() => {
    createMainViewComponent()
  })

  beforeEach((done) => {
    setWorkerRole(() => {
      loadEmployees()

      setTimeout(() => {
        handlePermissions(-1)
        done()
      }, 300)
    })
  })

  describe('ordinary task', () => {
    beforeAll(() => {
      displayDetails({
        id: -1,
        name: 'test-task',
        description: 'test-task description',
        status: 'doing',
        urgent: false,
        appeal: false,
        dueTime: 987654,
        creationTime: 5
      })
    })

    it('makes edit button disabled for workers when required', () => {
      expect($('.editButton').attr('disabled'))
        .toBeTruthy()
    })

    it('makes edit button enabled for managers', (done) => {
      setManagerRole(() => {
        handlePermissions(-1)
        expect($('.editButton').attr('disabled'))
          .toBeFalsy()
        done()
      })
    })

    it('makes delete button disabled for workers when required', () => {
      expect($('.deleteButton').attr('disabled'))
        .toBeTruthy()
    })

    it('makes delete button enabled for managers', (done) => {
      setManagerRole(() => {
        handlePermissions(-1)
        expect($('.editButton').attr('disabled'))
          .toBeFalsy()
        done()
      })
    })
  })

  describe('appeal task', () => {
    beforeAll(() => {
      displayDetails({
        id: -1,
        name: 'test-task',
        description: 'test-task description',
        status: 'doing',
        urgent: false,
        appeal: true,
        dueTime: 987654,
        creationTime: 5
      })
    })

    it('makes accept button disabled for workers when required', () => {
      expect($('.acceptButton').attr('disabled'))
        .toBeTruthy()
    })

    it('makes accept button enabled for managers', (done) => {
      setManagerRole(() => {
        handlePermissions(-1)
        expect($('.acceptButton').attr('disabled'))
          .toBeFalsy()
        done()
      })
    })

    it('makes reject button disabled for workers when needed', () => {
      expect($('.rejectButton').attr('disabled'))
        .toBeTruthy()
    })

    it('makes reject button enabled for managers', (done) => {
      setManagerRole(() => {
        handlePermissions(-1)
        expect($('.rejectButton').attr('disabled'))
          .toBeFalsy()
        done()
      })
    })
  })
})
