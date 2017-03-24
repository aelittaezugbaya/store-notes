/* flow */
/* eslint-env jasmine */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import {
  displayDetails
} from '../details'
import {
  displayCreateEditComponent
} from '../create'
import {
  createTaskComponent,
  createCompletedTaskComponent,
  createMainViewComponent
} from '..'
import {
  employeeStore
} from '../../../controller/store'
import {
  loadEmployees
} from '../../../controller/main'

describe('DOM elements', () => {
  describe('details view', () => {
    let task = {
      id: -999,
      name: 'test-task',
      description: 'test-task description',
      status: 'doing',
      urgent: false,
      appeal: true,
      dueTime: 987654,
      creationTime: 5
    }

    function addTaskToEmployee (
      username: string
    ) {
      let old = employeeStore.getEmployeeByUsername(username)
      employeeStore.deleteEmployee(username)
      employeeStore.addEmployee({
        ...old,
        tasks: List.of(task)
      })
    }

    beforeAll((done) => {
      loadEmployees(() => {
        createMainViewComponent()

        done()
      })
    })

    it('shows due date in correct format', () => {
      displayDetails(task)

      expect($('#dueTime').text()).toEqual('02:16, 1.01.1970')
    })

    it('shows creation date in a correct format', () => {
      displayDetails(task)

      expect($('#creationTime').text()).toEqual('02:00, 1.01.1970')
    })

    it('shows employees in a correct format', () => {
      addTaskToEmployee('pekka')
      addTaskToEmployee('anna')
      addTaskToEmployee('maija')

      displayDetails(task)

      expect($('#assignees').text())
        .toEqual('Pekka, Anna Maria, Maija Kristi')
    })
  })
})
