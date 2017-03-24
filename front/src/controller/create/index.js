/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import type {
  Task,
  Employee
} from '../../types'

import {
  updateMainView,
  updateFilterData,
  updateView
} from '../main'
import {
  taskStore,
  sectionStore,
  employeeStore,
  appStore,
  templateStore
} from '../store'
import {
  stringToTime
} from '../../core/time'
import {
  updateTask
} from '../../controller/update'
import {
  createTask as ajaxCreateTask,
  getSections,
  getEmployees,
  getEmployeeByUsername,
  getTaskTemplates
} from '../../core/ajax'
import {
  setCreatedTasks,
  getUsername
} from '../../core/auth'
import {
  displayCreateEditComponent
} from '../../views/main/create'
import {
  createTaskComponent,
  createCompletedTaskComponent
} from '../../views/main'

export function assembleTask (): Task {
  return {
    id: (taskStore.getTasks().isEmpty()
    ? 1
    : taskStore.getTasks().last().id + 1),
    name: $('#name').val(),
    description: $('#description').val(),
    section: {
      id: $('select#section').val(),
      name: sectionStore.getSections()
        .filter((p) => p.id === Number($('select#section').val()))
        .first().name,
      creationTime: '',
      dueTime: ''
    },
    employees: assembleEmployees(),
    creationTime: '',
    status: 'new',
    dueTime: $('#noDueDate').prop('checked') ? -1 : stringToTime($('#datePicker').val(), 'DD.MM.YYYY') +
      stringToTime($('#timePicker').val(), 'hh:mm AA', true),
    urgent:$(".urgent").get(0).checked ,
    appeal: $(".appeal").get(0).checked ,
    creator: {
      id: -1,
      name: '',
      rank: 'worker',
      username: '',
      password: '',
      tasks: List(),
      createdTasks: List(),
      email: ''
    }
  }
}

export function uploadTask (task: Task) {
  ajaxCreateTask(task)
  updateMainView()
}

export function assembleEmployees() {
  let employees = List()
  $('#allEmployees').get(0).checked
    ? employees = employeeStore.getEmployees()
    : typeof $('#employees').val() != 'string'
      ? $('#employees').val()
          .forEach((empl) =>
            employees = employees.push(employeeStore.getEmployees()
              .filter((e) => e.username === empl)
              .first())
          )
      : (employees = employees.push(employeeStore.getEmployees()
        .filter((e) => e.username === $('#employees').val())
        .first()))

  return employees
}

export function handleCreateEditTask (
  id?: number
) {
  let task = taskStore.getTasks()
    .filter((t) => t.id === id).first()

  displayCreateEditComponent(task)
  wireUpCreateEditComponent(task)
}
/*
export function handleCreateEditTask (
  id?: number
) {
  sectionStore.deleteAllSections()
  getSections((response) => {
    response.forEach((s) => { sectionStore.addSection(s) })

    employeeStore.deleteAllEmployees()
    getEmployees((response)=> {
      response.forEach((e) => {
        employeeStore.addEmployee({
          ...e,
          tasks: List(e.tasks)
        })
      })

      let task = taskStore.getTasks()
        .filter((t) => t.id === id).first()

      displayCreateEditComponent(task)
      wireUpCreateEditComponent(task)
    })
  })
}
*/
function wireUpCreateEditComponent(task?: Task) {
  sectionStore.getSections()
    .forEach((p) => $('select#section')
      .append($('<option value="' + p.id + '">' + p.name + '</option>')))

  employeeStore.getEmployees()
    .forEach((e) => $('select#employees')
      .append($('<option value="' + e.username +
        '" ' + (task && e.tasks.map((p) => p.id).includes(task.id) ? 'selected' : '') + '>'
        + e.name + '</option>')))

  $('#createUpdateForm').on('submit', (ev) => {
    ev.preventDefault()
    $('#taskCreateEdit').modal('hide')
    if (task) {
      updateTask(
        {
          ...assembleTask(),
          id: task.id,
          creationTime: task.creationTime
        }
      )
    } else {
      uploadTask(
        assembleTask()
      )
    }
  })

  $('#allEmployees').on('change', () => {
    $('#employees').prop(
      'disabled',
      $('#allEmployees').get(0).checked
    )
  })
  $('#noDueDate').on('change', () => {
    $('#timePicker').prop(
      'disabled',
      $('#noDueDate').get(0).checked
    )
    $('#datePicker').prop(
      'disabled',
      $('#noDueDate').get(0).checked
    )
  })

  $('#premadeTasks').on(
    'keyup',
    (ev) => {
      $('#name').val(ev.target.value)
      wrapPremadeTasks(ev.target.value)
    }
  )

  $('#premadeTasks').on(
    'click',
    (ev) => {
      wrapPremadeTasks(ev.target.value)
    }
  )

  $('.input-group.date').datepicker({
    format: 'dd.mm.yyyy',
	startDate: '0d',
	weekStart: 1,
	daysOfWeekHighlighted: "0,6",
    todayHighlight: true,
	autoclose: true,
	//disableTouchKeyboard: true

  })

  $('#timePicker').timepicker()

  $('.appeal').on('change', (ev) => {
    appStore.setAppeal(ev.target.checked)

    $('#employees').attr('multiple', !ev.target.checked)
  })

  $('.appeal').attr('disabled', task && task.appeal)
}

export function createTaskOnClient (
  task: Task,
  touchView?: boolean = true
) {
  taskStore.addTask(task)

  getEmployeeByUsername(getUsername(), (user) => {
    setCreatedTasks(List(user.createdTasks))

    if (touchView) {
      updateView()
    }
  })
}

export function createEmployeeOnClient (
  employee: Employee
) {
  employeeStore.addEmployee(employee)

  updateMainView()
  updateFilterData()
}
/*
function loadPremadeTasks() {
  //TODO: write logic for fetching premade tasks from backend

  let premadeTasks = [
    {
      id: 99999,
      name: 'Clean Fridge',
      description: 'text'
    },
    {
      id: 88888,
      name: 'Remove',
      description: 'text'
    },
    {
      id: 77777,
      name: 'Add more',
      description: 'text'
    },
    {
      id: 66666,
      name: 'Cashier is needed',
      description: 'text'
    },
    {
      id: 55555,
      name: 'Clean floor',
      description: 'text'
    },
    {
      id: 44444,
      name: 'Fix Fridge',
      description: 'text'
    },
    {
      id: 33333,
      name: 'Receive delivery',
      description: 'text'
    }
  ]
  return premadeTasks
}
*/
function loadPremadeTasks (): List<Task> {
  return templateStore.getTemplates()
}

export function wrapPremadeTasks (query: string) {
  $('#premadeTasksList').empty()
  let tasks = loadPremadeTasks()
  let regExp = new RegExp(query, 'i')
  tasks.forEach((task) => {
    if(regExp.test(task.name))
      $('#premadeTasksList').append('<li>' +
          '<a class="taskListElement" id="task'+task.id+'" href="#">' +
            task.name +
          '</a>' +
        '</li>'
      )
  })
  $('.taskListElement').on(
    'click',
    (ev) => {
      fillFormWithPremadeTask(Number(ev.target.id.substring(4)))
    }
  )
}

function fillFormWithPremadeTask(id: number) {
  let task = loadPremadeTasks()
    .filter((t) => t.id === id).first()
  $('#premadeTasks').val(task.name)
  $('#name').val($('#premadeTasks').val());
  $('#description').val(task.description)
}
