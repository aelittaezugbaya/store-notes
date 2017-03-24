/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import { employeeStore } from '../store'
import {
  getRole,
  getUsername,
  getCreatedTasks
} from '../../core/auth'
import {
  getEmployeeByUsername
} from '../../core/ajax'

import type {
  Employee,
  Task
} from '../../types'

export function hideDetails () {
  $('#taskDetails').attr('hidden', true)
}

export function getEmployeesByTaskId (
  id: number
): List<Employee> {
  //console.log(employeeStore.getEmployees().toArray())
  return employeeStore.getEmployees()
    .filter((e) => !e.tasks
      .filter((t) => t.id === id)
      .isEmpty())
}

export function handlePermissions(
  task: Task
) {
    $('.detailsFooter .acceptButton, .detailsFooter .rejectButton').prop(
      'disabled',
      getRole() === 'USER' &&
        employeeStore.getEmployees()
         .filter((t) => t.username === getUsername())
         .first()
         .tasks
         .filter((t) => t.id === task.id)
         .isEmpty()
    )

    $('.detailsFooter .deleteButton, .detailsFooter .editButton').prop(
      'disabled',
      getRole() === 'USER' &&
        getCreatedTasks()
         .filter((t) => t.id === task.id)
         .isEmpty()
    )
}
