/* flow */
/* eslint-env jasmine */
'use strict'

import { List } from 'immutable'

import $ from 'jquery'

import { checkAuth } from '../../../core/auth'
import {
  createMainViewComponent,
  createTaskComponent,
  createCompletedTaskComponent
} from '../../../views/main'
import {
  loadEmployees,
  updateView,
  updateCompletedTasksView
} from '..'

describe('main view display logic', () => {
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

  describe('current task elements', () => {
    beforeAll(() => {
      createTaskComponent({
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

    describe('ordinary tasks', () => {
      beforeEach((done) => {
        setWorkerRole(() => {
          loadEmployees()

          setTimeout(() => {
            updateView(List.of({
              id: -1,
              name: 'test-task',
              description: 'test-task description',
              status: 'doing',
              urgent: false,
              appeal: false,
              dueTime: 987654,
              creationTime: 5
            }))
            done()
          }, 300)
        })
      })

      it('makes edit button disabled for workers when needed', () => {
        expect($('#task' + (-1) + ' .editButton').attr('disabled'))
          .toBeTruthy()
      })

      it('makes edit button enabled for managers', (done) => {
        setManagerRole(() => {
          createTaskComponent({
            id: -2,
            name: 'test-task',
            description: 'test-task description',
            status: 'doing',
            urgent: false,
            appeal: false,
            dueTime: 987654,
            creationTime: 5
          })
          expect($('#task' + (-2) + ' .editButton').attr('disabled'))
            .toBeFalsy()
          done()
        })
      })

      it('makes delete button disabled for workers when needed', () => {
        expect($('#task' + (-1) + ' .deleteButton').attr('disabled'))
          .toBeTruthy()
      })

      it('makes delete button enabled for managers', (done) => {
        setManagerRole(() => {
          createTaskComponent({
            id: -3,
            name: 'test-task',
            description: 'test-task description',
            status: 'doing',
            urgent: false,
            appeal: false,
            dueTime: 987654,
            creationTime: 5
          })
          expect($('#task' + (-3) + ' .deleteButton').attr('disabled'))
            .toBeFalsy()
          done()
        })
      })
    })

    describe('appeal tasks', () => {
      beforeEach((done) => {
        setWorkerRole(() => {
          loadEmployees()

          setTimeout(() => {
            updateView(List.of({
              id: -20,
              name: 'test-task',
              description: 'test-task description',
              status: 'doing',
              urgent: false,
              appeal: true,
              dueTime: 987654,
              creationTime: 5
            }))
            done()
          }, 300)
        })
      })

      it('makes accept button disabled for workers when needed', () => {
        expect($('#task' + (-20) + ' .acceptButton').attr('disabled'))
          .toBeTruthy()
      })

      it('makes accept button enabled for managers', (done) => {
        setManagerRole(() => {
          createTaskComponent({
            id: -21,
            name: 'test-task',
            description: 'test-task description',
            status: 'doing',
            urgent: false,
            appeal: true,
            dueTime: 987654,
            creationTime: 5
          })
          expect($('#task' + (-21) + ' .acceptButton').attr('disabled'))
            .toBeFalsy()
          done()
        })
      })

      it('makes reject button disabled for workers when needed', () => {
        expect($('#task' + (-20) + ' .rejectButton').attr('disabled'))
          .toBeTruthy()
      })

      it('makes reject button enabled for managers', (done) => {
        setManagerRole(() => {
          createTaskComponent({
            id: -22,
            name: 'test-task',
            description: 'test-task description',
            status: 'doing',
            urgent: false,
            appeal: true,
            dueTime: 987654,
            creationTime: 5
          })
          expect($('#task' + (-22) + ' .rejectButton').attr('disabled'))
            .toBeFalsy()
          done()
        })
      })
    })
  })

  describe('completed task elements', () => {
    beforeAll(() => {
      createCompletedTaskComponent({
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

    beforeEach((done) => {
      setWorkerRole(() => {
        loadEmployees()

        setTimeout(() => {
          updateCompletedTasksView(List.of({
            id: -50,
            name: 'test-task',
            description: 'test-task description',
            status: 'done',
            urgent: false,
            appeal: false,
            dueTime: 987654,
            creationTime: 5
          }))
          done()
        }, 300)
      })
    })

    it('makes delete button disabled for workers when needed', () => {
      expect($('#task' + (-50) + ' .deleteButton').attr('disabled'))
        .toBeTruthy()
    })

    it('makes delete button enabled for managers', (done) => {
      setManagerRole(() => {
        createCompletedTaskComponent({
          id: -51,
          name: 'test-task',
          description: 'test-task description',
          status: 'doing',
          urgent: false,
          appeal: false,
          dueTime: 987654,
          creationTime: 5
        })
        expect($('#task' + (-51) + ' .deleteButton').attr('disabled'))
          .toBeFalsy()
        done()
      })
    })
  })
})
