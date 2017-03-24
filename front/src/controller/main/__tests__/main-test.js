/* flow */
/* eslint-env jasmine */
'use strict'

import {
  checkAuth
} from '../../../core/auth'
import {
  loadTasks,
  loadEmployees,
  loadSections,
  filterTasks
} from '..'
import {
  taskStore,
  employeeStore,
  sectionStore
} from '../../store'
import {
  createTask
} from '../../../core/ajax'

describe('main functionality', () => {
  describe('loaders', () => {
    beforeAll(() => {
      sessionStorage.setItem('username', 'pekka')
      sessionStorage.setItem('password', '123456')
      checkAuth()

      taskStore.deleteAllTasks()
      employeeStore.deleteAllEmployees()
      sectionStore.deleteAllSections()
    })

    it('loads tasks', (done) => {
      expect(taskStore.getTasks().size)
        .toEqual(0)

      createTask(
        {
          name: '',
          description: '',
          appeal: false,
          urgent: false,
          status: 'NEW'
        },
        (response) => {
          loadTasks()

          setTimeout(() => {
            expect(taskStore.getTasks().size)
              .toBeGreaterThan(0)

            done()
          }, 500)
        },
        (xhr) => fail()
      )
    })

    it('loads sections', (done) => {
      expect(sectionStore.getSections().size)
        .toEqual(0)

      loadSections()

      setTimeout(() => {
        expect(sectionStore.getSections().size)
          .toBeGreaterThan(0)

        done()
      }, 300)
    })

    it('loads employees', (done) => {
      expect(employeeStore.getEmployees().size)
        .toEqual(0)

      loadEmployees(() => {
        expect(employeeStore.getEmployees().size)
          .toBeGreaterThan(0)

        done()
      })
    })
  })

  describe('DOM update functionality', () => {
    it('updates main view correctly', () => {

    })

    it('updates main complete tasks view correctly', () => {

    })

    it('updates filter data correctly', () => {

    })
  })

  describe('utilities', () => {
    beforeAll(() => {
      taskStore.deleteAllTasks()

      taskStore.addTask({
        id: 1,
        name: 'test-task',
        description: 'test-description',
        status: 'NEW',
        section: {
          name: 'Meat section'
        },
        creationTime: 0,
        dueTime: 100
      })

      taskStore.addTask({
        id: 2,
        name: 'test-task111',
        description: 'another description',
        status: 'NEW',
        section: {
          name: 'Pastry section'
        },
        creationTime: 1,
        dueTime: 101
      })

      taskStore.addTask({
        id: 3,
        name: 'test-task112',
        description: 'yet another description',
        status: 'NEW',
        section: {
          name: 'Meat section'
        },
        creationTime: 2,
        dueTime: 102
      })

      taskStore.addTask({
        id: 4,
        name: 'test-task333',
        description: 'another test-description',
        status: 'DOING',
        section: {
          name: 'Pastry section'
        },
        creationTime: 3,
        dueTime: 103
      })

      taskStore.addTask({
        id: 5,
        name: 'test-task555',
        description: 'yet another test-description',
        status: 'DOING',
        section: {
          name: 'Dairy section'
        },
        creationTime: 4,
        dueTime: 104
      })

      taskStore.addTask({
        id: 6,
        name: 'test-task556',
        description: 'final test-description',
        status: 'DONE',
        section: {
          name: 'Dairy section'
        },
        creationTime: 5,
        dueTime: 105
      })

      let prevPekka = employeeStore.getEmployeeByUsername('pekka')
      employeeStore.deleteEmployee('pekka')
      employeeStore.addEmployee({
        ...prevPekka,
        tasks: prevPekka.tasks.push({
          id: 6,
          name: 'test-task556',
          description: 'final test-description',
          status: 'DONE',
          section: {
            name: 'Dairy section'
          },
          creationTime: 5,
          dueTime: 105
        })
      })
    })

    describe('task filtering', () => {
      it('filters tasks by assignee', () => {
        expect(filterTasks({
          employee: {
            username: 'pekka',
            name: 'pekka',
            rank: 'WORKER'
          }
        }).size).toEqual(1)
      })

      it('filtes tasks by location', () => {
        expect(filterTasks({
          section: {
            name: 'Dairy section'
          }
        }).size).toEqual(2)
      })

      it('filtes tasks by status', () => {
        expect(filterTasks({
          status: 'new'
        }).size).toEqual(3)
      })

      it('filtes tasks by creation time', () => {
        expect(filterTasks({
          creationTime: {
            earliestTime: 3,
            latestTime: 5
          }
        }).size).toEqual(3)
      })

      it('filtes tasks by due time', () => {
        expect(filterTasks({
          dueTime: {
            earliestTime: 103,
            latestTime: 105
          }
        }).size).toEqual(3)
      })
    })

    describe('task search', () => {
      it('searches for a match in task names', () => {
        expect(filterTasks({
          name: 'test-task1'
        }).size).toEqual(2)
      })

      it('searches for a match in task description', () => {
        expect(filterTasks({
          description: 'description'
        }).size).toEqual(2)
      })

      it('searches task names case-insensitively', () => {
        expect(filterTasks({
          name: 'TEST-task1'
        }).size).toEqual(2)
      })

      it('searches task description case-insensitively', () => {
        expect(filterTasks({
          description: 'descRIPTION'
        }).size).toEqual(2)
      })
    })
  })
})
