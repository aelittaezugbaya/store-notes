/* @flow */
'use strict'

import type {
  Task,
  TaskStatus,
  Employee
} from '../../types'

import { taskStore } from '../store'
import {
  updateMainView
} from '../main'
import {
  createTaskOnClient,
  createEmployeeOnClient
} from '../create'
import {
  deleteTaskOnClient,
  deleteEmployeeOnClient
} from '../delete'
import {
  updateTask as ajaxUpdateTask
} from '../../core/ajax'

export function updateTask(
  task: Task
) {
  ajaxUpdateTask(task)
}

export function updateTaskOnClient (
  task: Task
) {
  deleteTaskOnClient(task.id)
  createTaskOnClient(task)
}

export function updateEmployeeOnClient (
  employee: Employee
) {
  deleteEmployeeOnClient(employee.username)
  createEmployeeOnClient(employee)
}

export function changeTaskStatus (
  id: number,
  status: TaskStatus
) {
  let doingTask = taskStore.getTasks()
    .filter((t) => t.id === id).first()

  updateTask({
    ...doingTask,
    status: status
  })
}
