/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import {
  start
} from '../controller/main'
import { getEmployees } from './ajax'
import {
  displayAuthComponent
} from '../views/auth'
import {
  taskStore,
  sectionStore,
  employeeStore,
  appStore
} from '../controller/store'

import type {
  Role,
  Task
} from '../types'

let username = ''
let password = ''
let role = ''
let createdTasks = List()

export function getUsername (): string {
  return sessionStorage.getItem('username') || ''
}
export function getPassword (): string {
  return sessionStorage.getItem('password') || ''
}
export function getRole (): string {
  return role
}

export function getCreatedTasks (): List<Task> {
  return createdTasks
}

export function setCreatedTasks (
  tasks: List<Task>
) {
  createdTasks = tasks
}

export function addCreatedTask (
  task: Task
) {
  createdTasks = createdTasks.push(task)
}

export function removeCreatedTask (
  id: number
) {
  createdTasks = createdTasks.filterNot((t) => t.id === id)
}

export function initAuth () {
  username = sessionStorage.getItem('username')
  password = sessionStorage.getItem('password')
  checkAuthAndStart()

  $(document).on('click', '#submitAuth', (ev) => {
    ev.preventDefault()
    username = $('#username').val()
    password = $('#pwd').val().toString()

    sessionStorage.setItem('username', username)
    sessionStorage.setItem('password', password)

    checkAuthAndStart()
  })
}

export function singOut() {
  sessionStorage.setItem('username', '')
  sessionStorage.setItem('password', '')

  username = ''
  password = ''
  role = ''
  createdTasks = List()

  taskStore.deleteAllTasks()
  sectionStore.deleteAllSections()
  employeeStore.deleteAllEmployees()
  appStore.setDefault()

  location.reload()

  initAuth()
}

export function checkAuth (callback?: any = () => null) {
  getEmployees((response) => {
    let currUser = List(response).filter((e) => e.username === sessionStorage.getItem('username'))
      .first()

    role = currUser.rank === 'MANAGER'
    ? 'ADMIN'
    : 'USER'

    setCreatedTasks(List(currUser.createdTasks))

    callback()
  }, (xhr) => displayAuthComponent() )
}

export function checkAuthAndStart () {
  checkAuth(start)
}
