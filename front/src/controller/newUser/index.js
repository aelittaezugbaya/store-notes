/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import { start } from '../main'
import { createEmployee } from '../../core/ajax'
import {
  validateForm,
  bindValidation
} from './form-validation'

import type { Employee } from '../../types'

function assembleEmployee (): Employee {
  return {
    username: $('#usernameInput').val(),
    password: $('#password').val(),
    name: $('#firstName').val() + ' ' + $('#lastName').val(),
    rank: $('#rank').val(),
    email: $('#email').val(),
    tasks: List(),
    createdTasks: List()
  }
}

export function wireUpNewUser () {
  bindValidation()

  $('#returnButton, #cancelButton').on(
    'click',
    (ev) => {
      location.reload()
    }
  )

  setTimeout(() => {
    $('input').val('')
  }, 300)

  $('#createNewUserButton').on(
    'click',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()

      if (validateForm()) {
        let newEmployee = assembleEmployee()
        createEmployee(
          newEmployee,
          (response) => {
            start()
          }
        )
      }
    }
  )
}
