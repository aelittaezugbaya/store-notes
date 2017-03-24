/* @flow */
'use strict'

import $ from 'jquery'

import { Base64 } from 'js-base64'
import { List } from 'immutable'

import type {
  Task,
  Employee
} from '../types'

import {
  getUsername,
  getPassword
} from './auth'

const noop = () => {}

function beforeSend (xhr: any) {
  xhr.setRequestHeader(
    'Authorization',
    'Basic ' + Base64.encode(getUsername() + ':' + getPassword())
  )
}

export function getTasks (
  success?: any = noop,
  failure?: any = noop
): any {
  return $.ajax({
    url: '/back/webresources/tasks',
    type: 'GET',
    dataType: 'json',
    beforeSend: beforeSend,
    success: success,
    error: failure
  })
}

export function createTask (
  task: Task,
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/tasks',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      name: task.name,
      description: task.description,
      dueTime: task.dueTime,
      section: task.section,
      urgent: task.urgent,
      appeal: task.appeal,
      status: task.status.toUpperCase()
    }),
    beforeSend: beforeSend,
    success: (response) => {
      if (task.employees !== undefined && !task.employees.isEmpty()) {
        task.employees.forEach((e) => addTaskToEmployee(response, e.username))
      }

      success()
    },
    error: failure
  })
}

export function deleteTask (
  id: number,
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/tasks/' + id,
    type: 'DELETE',
    dataType: 'json',
    beforeSend: beforeSend,
    success: success,
    error: failure
  })
}

export function updateTask (
  task: Task,
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/tasks/' + task.id,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      name: task.name,
      description: task.description,
      creationDate: task.creationTime,
      section: task.section,
      dueTime: task.dueTime,
      urgent: task.urgent,
      appeal: task.appeal,
      status: task.status.toUpperCase(),
      employees: task.employees ? task.employees.toArray() : []
    }),
    beforeSend: beforeSend,
    success: (response) => {
      if (task.employees !== undefined && !task.employees.isEmpty()) {
        task.employees.forEach((e) => addTaskToEmployee(task, e.username))
      }

      success(response)
    },
    error: failure
  })
}

export function createEmployee (
  employee: Employee,
  success?: any = noop,
  failure?: any = noop
) {
  console.log(employee)
  $.ajax({
    url: '/back/webresources/employees',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      username: employee.username,
      name: employee.name,
      password: employee.password,
      email: employee.email,
      rank: employee.rank,
      tasks: [],
      createdTasks: []
    }),
    beforeSend: beforeSend,
    success: success,
    error: failure
  })
}

export function getEmployeeByUsername (
  username: string,
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/employees/' + username,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: beforeSend,
    success: (response) => {
      response.tasks = List(response.tasks)
      response.createdTasks = List(response.createdTasks)
      success(response)
    },
    error: failure
  })
}

export function getEmployees (
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/employees/',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: beforeSend,
    success: (response) => {
      response.tasks = List(response.tasks)
      response.createdTasks = List(response.createdTasks)
      success(response)
    },
    error: failure
  })
}

export function updateEmployee (
  employee: Employee,
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/employees/' + employee.username,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: beforeSend,
    data: JSON.stringify({
      ...employee,
      tasks: employee.tasks.toArray()
    }),
    success: success,
    error: failure
  })
}

function addTaskToEmployee (
  task: Task,
  username: string,
  success?: any = noop,
  failure?: any = noop
) {
  getEmployeeByUsername(
    username,
    (employee) => {
      employee.tasks = employee.tasks.push(task)
      updateEmployee(
        employee,
        success,
        failure
      )
    },
    failure
  )
}

export function getSections (
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/sections/',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: beforeSend,
    success: success,
    error: failure
  })
}

export function getTaskTemplates (
  success?: any = noop,
  failure?: any = noop
) {
  $.ajax({
    url: '/back/webresources/tasks/?templates=true',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: beforeSend,
    success: success,
    error: failure
  })
}
