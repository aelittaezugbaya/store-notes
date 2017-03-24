/* @flow */
'use strict'

import { List } from 'immutable'

import { sortTasks } from '../core/sort'
import {
  getRole,
  getUsername,
  getCreatedTasks
} from '../core/auth'

import type {
  Task,
  Section,
  Employee,
  ViewState,
  TaskFilter,
  PageState
} from '../types'

type AppState = {
  page: PageState,
  view: ViewState,
  createForm: {
    employees: List<string>,
    isAppeal: boolean
  } | null,
  filters: TaskFilter,
  onNotification: any // internal logic on notification recieved
}

let tasks = List()
let sections = List()
let employees = List()
let templates = List()
let app: AppState = {
  page: 'main',
  view: 'current',
  createForm: null,
  filters: {},
  onNotification: () => null
}

export let appStore = {
  setDefault: () => {
    return {
      view: 'current',
      createForm: null,
      filters: {},
      onNotification: () => null
    }
  },

  triggerNotifLogic: () => app.onNotification(),

  getPage: () => {
    return app.page
  },

  setPage: (newPage: PageState) => {
    app.page = newPage
  },

  getView: () => {
    return app.view
  },

  setView: (newView: ViewState) => {
    app.view = newView
  },

  startCreateProcess: () => {
    app.createForm = {
      employees: List(),
      isAppeal: false
    }
  },

  setSelectedEmployees: (employees: List<string>) => {
    if (app.createForm) {
      app.createForm.employees = employees
    }
  },
  getSelectedEmployees: () => {
    return app.createForm && app.createForm.employees
  },

  setAppeal: (isAppeal: boolean) => {
    if (app.createForm) {
      app.createForm.employees = isAppeal && app.createForm.employees.size > 0
      ? List.of(app.createForm.employees.first())
      : app.createForm.employees

      app.createForm.isAppeal = isAppeal
    }
  },
  getAppeal: () => {
    return app.createForm && app.createForm.isAppeal
  },

  stopCreateProcess: () => {
    app.createForm = null
  },

  changeFilters: (filterObj: any) => {
    app.filters = {
      ...app.filters,
      ...filterObj
    }
  },

  getFilters: () => {
    return app.filters
  }
}

export let taskStore = {
  getTasks: () => {
    return sortTasks(tasks)
  },

  getById: (id: number) => {
    return tasks.find((t) => t.id === id) || null
  },

  deleteTask: (id: number) => {
      tasks = tasks.filterNot((p) => p.id === id)
  },

  addTask: (task: Task) => {
    if (tasks.filter((t) => t.id === task.id).isEmpty()) {
      tasks = tasks.push({
        ...task,
        status: task.status.toLowerCase() === 'new'
        ? 'new'
        : task.status.toLowerCase() === 'doing'
          ? 'doing'
          : 'done'
      })
    }
  },

  deleteAllTasks: () => {
    tasks = List()
  },

  updateTask: (
    id: number,
    task: Task
  ) => {
    tasks = tasks.filterNot((p) => p.id === id)
      .push({
        ...task
      })
  }
}

export let sectionStore = {
  getSections: () => {
    return sections
  },

  deleteAllSections: () => {
    sections = List()
  },

  addSection: (section: Section) => {
    if (sections.filter((s) => s.id === section.id).isEmpty()) {
      sections = sections.push(section)
    }
  }
}

export let employeeStore = {
  getEmployees: (): List<Employee> => {
    return employees
  },

  getEmployeeByUsername: (name: string): Employee => {
    return employeeStore.getEmployees()
      .filter((e) => e.username === name).first()
  },

  deleteAllEmployees: () => {
    employees = List()
  },

  deleteEmployee: (username: string) => {
    employees = employees.filterNot((e) => e.username === username)
  },

  addEmployee: (employee: Employee) => {
    if (employees.filter((e) => e.username === employee.username).isEmpty()) {
      employees = employees.push(employee)
    }
  }
}

export let templateStore = {
  getTemplates: () => {
    return templates
  },

  addTemplate: (template: Task) => {
    templates = templates.push(template)
  },

  deleteAll: () => {
    templates = List()
  }
}
