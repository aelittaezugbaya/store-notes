/* @flow */
'use strict'

import $ from 'jquery'

import {
  updateView
} from '../main'
import {
  taskStore,
  employeeStore
} from '../store'
import {
  deleteTask as ajaxDeleteTask
} from '../../core/ajax'
import {
  removeCreatedTask
} from '../../core/auth'

export function deleteTask (id: number) {
  ajaxDeleteTask(id)
}

export function deleteTaskOnClient (
  id: number,
  touchView?: boolean = true
) {
  taskStore.deleteTask(id);

  removeCreatedTask(id)

  if (touchView) {
    updateView()
  }
}

export function deleteEmployeeOnClient (
  username: string
) {
  employeeStore.deleteEmployee(username)
}
