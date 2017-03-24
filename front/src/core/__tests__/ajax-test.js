/* flow */
/* eslint-env jasmine */
'use strict'

import { List } from 'immutable'

import {
  getSections,
  getEmployees,
  getTaskTemplates,
  getTasks,
  createTask,
  updateTask,
  getEmployeeByUsername,
  deleteTask
} from '../ajax'

describe('ajax communication with the server', () => {
  beforeAll(() => {
    sessionStorage.setItem('username', 'anna')
    sessionStorage.setItem('password', '123456')
  })
  const noop = () => null

  const failCase = (done) => {
    fail()
    done()
  }

  describe('employees', () => {
    it('gets all the employees', (done) => {
      getEmployees(
        (response, status, xhr) => {

          expect(List(response).size).toBeGreaterThan(0)
          done()
        },
        (xhr) => failCase(done)
      )
    })

    it('gets a specific employee', (done) => {
      let username = 'pekka'

      getEmployeeByUsername(
        username,
        (r) => {
          expect(r.username).toEqual(username)
          done()
        },
        (xhr) => failCase(done)
      )
    })
  })

  describe('tasks', () => {
    describe('general task manipulations', () => {
      beforeEach((done) => {
        createTask({
          name: '',
          description: '',
          status: 'NEW'
        }, (r) => done())
      })

      it('gets all the tasks', (done) => {
        getTasks(
          (response) => {
            expect(List(response).size).toBeGreaterThan(0)
            done()
          },
          (xhr) => failCase(done)
        )
      })

      it('updates a task', (done) => {
        getTasks(
          (response) => {
            let tasks = List(response)

            updateTask(
              {
                id: tasks.first().id,
                name: 'updated name',
                description: 'updated description',
                status: 'NEW'
              },
              (response) => {
                let updatedTask = response

                expect(updatedTask.name).toEqual('updated name')
                expect(updatedTask.description).toEqual('updated description')
                done()
              },
              (xhr) => failCase(done)
            )
          },
          (xhr) => failCase(done)
        )
      })

      it('deletes a task', (done) => {
        getTasks(
          (response) => {
            let tasks = List(response)
            let initSize = tasks.size
            deleteTask(
              tasks.first().id,
              (response) => {
                getTasks(
                  (response) => {
                    expect(List(response).size).toEqual(initSize - 1)
                    done()
                  },
                  (xhr) => failCase(done)
                )
              },
              (xhr) => failCase(done)
            )
          },
          (xhr) => failCase(done)
        )
      })

      it('creates a new task', (done) => {
        getTasks(
          (response) => {
            let initSize = List(response).size

            createTask(
              {
                name: 'new name',
                description: 'new description',
                status: 'NEW'
              },
              (response) => {
                getTasks(
                  (response) => {
                    expect(List(response).size).toEqual(initSize + 1)
                    done()
                  },
                  (xhr) => failCase(done)
                )
              },
              (xhr) => failCase(done)
            )
          },
          (xhr) => failCase(done)
        )
      })
    })
  })

  describe('store sections', () => {
    it('gets all the store sections', (done) => {
      getSections(
        (response) => {
          expect(List(response).size).toBeGreaterThan(0)
          done()
        },
        (xhr) => failCase(done)
      )
    })
  })
/*
  describe('premade task templates', () => {
    it('gets all the task templates', (done) => {
      getTaskTemplates(
        (response) => {
          expect(List(response).size).toBeGreaterThan(0)
          done()
        },
        (xhr) => { console.log(xhr); failCase(done)}
      )
    })
  })
*/
})
