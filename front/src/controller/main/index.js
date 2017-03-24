/* @flow */
'use strict'

import $ from 'jquery'
import moment from 'moment'

import { List } from 'immutable'

import type {
  Task,
  TaskStatus,
  Employee,
  Section,
  TaskFilter
} from '../../types'

import {
  getEmployeesByTaskId
} from '../../controller/details'
import {
  taskStore,
  employeeStore,
  sectionStore,
  appStore,
  templateStore
} from '../store'
import {
  displayDetails
} from '../../views/main/details'
import {
  updateTask,
  changeTaskStatus
} from '../update'
import {
  deleteTask
} from '../delete'
import {
  handleCreateEditTask
} from '../create'
import {
  handlePermissions
} from '../details'
import {
  wireUpNewUser
} from '../newUser'
import {
  getTasks,
  getEmployees,
  getSections,
  getTaskTemplates
} from '../../core/ajax'
import {
  singOut,
  getRole,
  getCreatedTasks,
  getUsername
} from '../../core/auth'
import {
  createTaskComponent,
  createMainViewComponent,
  createCompletedTaskComponent,
  createNewUser
} from '../../views/main'

import {
  stringToTime,
  timeToString
} from '../../core/time'

import {
  handleProgressBars,
  handleLastProgressBar
} from './progress-bar'

export function loadTasks () {
  getTasks((response) => {
    taskStore.deleteAllTasks()
    response.forEach((t) => taskStore.addTask({
      ...t,
      status: t.status.toLowerCase()
    }))
    updateView()

    // handle time progress bar
    setInterval(() => {
      handleProgressBars()
    }, 2000)
  })
}

export function loadEmployees (callback?: any = (() => {})) {
  employeeStore.deleteAllEmployees()
  getEmployees((response) => {
    response.forEach((t) => employeeStore.addEmployee({
      ...t,
      tasks: List(t.tasks)
    }))
    updateMainView()
    updateFilterData()

    callback()
  })
}

export function loadSections() {
  sectionStore.deleteAllSections()
  getSections((response) => {
    response.forEach((s) => { sectionStore.addSection(s) })
    updateMainView()
    updateFilterData()
  })
}

function loadTemplates() {
  templateStore.deleteAll()
  getTaskTemplates((response) => {
    List(response).forEach((p) => templateStore.addTemplate(p))
  })
}

export function updateView(
  tasks?: List<Task>
) {
  if (appStore.getPage() === 'main') {
    appStore.getView() === 'current'
      ? updateMainView(tasks)
      : updateCompletedTasksView(tasks)
  }
}

export function updateMainView (
  tasks?: List<Task>
) {
  let displayableTasks = tasks !== undefined
  ? tasks
  : taskStore.getTasks()
  $('.taskWrapper').remove()
  $('.newUserPage').remove()
  displayableTasks.forEach((task) => {
    if (task.status !== 'done') {
      createTaskComponent(task)
      handleLastProgressBar()

      if (task.appeal) {
        $('#task' + task.id + ' .acceptButton, #task' + task.id + ' .rejectButton').prop(
          'disabled',
          getRole() === 'USER' &&
            employeeStore.getEmployees()
             .filter((t) => t.username === getUsername())
             .first()
             .tasks
             .filter((t) => t.id === task.id)
             .isEmpty()
        )
      } else {
        $('#task' + task.id + ' .deleteButton, #task' + task.id + ' .editButton').prop(
          'disabled',
          !canUserDelete(task)
        )
      }

      handleProgressBars()
    }
  })

  $('#addTaskButton').removeClass('hidden')
}

function canUserDelete (task: Task): boolean {
  return !(getRole() === 'USER' &&
    getCreatedTasks()
     .filter((t) => t.id === task.id)
     .isEmpty())
}

export function updateFilterData () {
  $('#employeeFilter').empty().append($(
    '<a href="#"><li class="employeeOption">' +
      'All employees' +
    '</li></a>'
  ))
  $('#sectionFilter').empty().append($(
    '<a href="#"><li class="sectionOption">' +
      'All sections' +
    '</li></a>'
  ))
  employeeStore.getEmployees()
    .forEach((e) => $('#employeeFilter')
      .append($(
        '<a><li class="employeeOption" data-username="'+ e.username +'">' +
          '<span>'+ e.name +'</span>' +
        '</li></a>')))
  sectionStore.getSections()
    .forEach((p) => $('#sectionFilter')
      .append($(
        '<a href="#" style="font:black"><li class="sectionOption" data-name="'+ p.name +'">' +
          '<span>'+ p.name +'</span>' +
        '</li></a>')))
  $('.sectionOption').on(
    'click',
    (ev) => {
      ev.preventDefault()

      let section = sectionStore.getSections()
        .filter((t) => $($(ev.target)
          .closest('li.sectionOption')
          .get(0)).data('name') === t.name)
        .first()

      appStore.changeFilters({section})
      handleFilter()
      $('#sectionDropdown').html(
        section
        ? section.name + ' <span class="caret"></span>'
        : 'All sections <span class="caret"></span>'
      )
    }
  )

  $('.employeeOption').on(
    'click',
    (ev) => {
      ev.preventDefault()

      let employee = employeeStore.getEmployees()
        .filter((t) => $($(ev.target)
          .closest('li.employeeOption')
          .get(0)).data('username') === t.username)
        .first()

      appStore.changeFilters({employee})
      handleFilter()

      $('#employeeDropdown').html(
        employee
        ? employee.name + ' <span class="caret"></span>'
        : 'All employees <span class="caret"></span>'
      )
    }
  )
}
export function updateCompletedTasksView (
  tasks?: List<Task>
) {
  let displayableTasks = tasks !== undefined
  ? tasks
  : taskStore.getTasks()
  $('.taskWrapper').remove()
  $('.newUserPage').remove()
  displayableTasks.forEach((t) => {
    if (t.status === 'done') {
      createCompletedTaskComponent(t)

      $('#task' + t.id + ' .deleteButton').prop(
        'disabled',
        !canUserDelete(t)
      )
    }
  })

  $('#addTaskButton').addClass('hidden')
}

function navTabsMakeActive(ev) {
  Array.from($('#main-nav').children()).forEach((c) => $(c).removeClass('active'));
  $(ev.target).parent().addClass('active');
  appStore.setView(
    ev.target.id === 'showTasks'
    ? 'current'
    : 'completed'
  )
}

function handleFilter () {
  updateView(
    filterTasks(appStore.getFilters())
  )
}

export function filterTasks ({
  name,
  description,
  creationTime,
  status,
  employee,
  section,
  dueTime
}: TaskFilter): List<Task> {
  return taskStore.getTasks().filter((t) => {
    return(
    name
    ? t.name.toLowerCase().search(name.trim().toLowerCase()) !== -1
    : true
  ) &&
  (
    description
    ? t.description.toLowerCase()
        .search(description.trim().toLowerCase() + ' ') !== -1 ||
      t.description.toLowerCase()
        .search(' ' + description.trim().toLowerCase()) !== -1
    : true
  ) &&
  (
    status
    ? t.status === status
    : true
  ) &&
  (
    employee
    ? getEmployeesByTaskId(t.id)
      .indexOf(
        employeeStore.getEmployees()
        .filter((e) => employee && e.username === employee.username)
        .first()
      ) !== -1
    : true
  ) &&
  (
    section
    ? t.section &&
      t.section.name === section.name
    : true
  ) &&
  (
    creationTime
    ? creationTime.earliestTime && creationTime.latestTime
      ? moment(t.creationTime).valueOf() >= creationTime.earliestTime &&
        moment(t.creationTime).valueOf() <= creationTime.latestTime
      // : creationTime.earliestTime
      //   ? moment(t.creationTime).valueOf() >= creationTime.earliestTime
      //   : creationTime.latestTime
      //     ? moment(t.creationTime).valueOf() <= creationTime.earliestTime
      : true
    : true
  ) &&
  (
    dueTime
    ? dueTime.earliestTime && dueTime.latestTime
      ? moment(t.dueTime).valueOf() >= dueTime.earliestTime &&
        moment(t.dueTime).valueOf() <= dueTime.latestTime
      : dueTime.earliestTime
        ? moment(t.dueTime).valueOf() >= dueTime.earliestTime
        : dueTime.latestTime
          ? moment(t.dueTime).valueOf() <= dueTime.earliestTime
          : true
    : true
  )
  })
}

export function start () {
  appStore.setPage('main')
  appStore.setView('current')
  // load tasks from server
  // loadTasks()
  // load employees from server
  loadEmployees(loadTasks)

  loadSections()

  loadTemplates()
  // draw main component
  createMainViewComponent()
  // init date pickers functionality
  handleDatePicker()

  if (getRole() === 'USER') {
    $('#createUserButton').remove()
  }

	$('#main-nav').children()
    .each(function() {
      this.className === 'active'
      ? appStore.setView(
        $(this).children().get(0).id === 'showTasks'
        ? 'current'
        : 'completed'
      )
      : null
    })

  $('body').on(
    'click',
    '#showTasks',
    (ev) => {
      ev.preventDefault()

      navTabsMakeActive(ev);
      updateView()
    }
  )

  $('body').on(
    'click',
    '#showCompleted',
    (ev) => {
      ev.preventDefault()

      navTabsMakeActive(ev);
      updateCompletedTasksView()
    }
  )


  // wire up details modal
  $('body').on(
    'click',
    '.taskWrapper',
    (ev) => {
      ev.preventDefault()

      let task = taskStore.getTasks()
        .filter((p) =>
        p.id === Number(
          $(ev.target)
            .closest('.taskWrapper')
            .get(0)
            .id
            .substring(4))
          )
        .first()

      displayDetails(task)
      handlePermissions(task)
      $('#taskDetails').modal('show')

      }
  )
  // wire up New Task modal
  $('body').on(
    'click',
    '#addTaskButton',
    (ev) => {
      ev.preventDefault()

      handleCreateEditTask()
      $('#taskCreateEdit').modal('show')
     }
  )
  // wire up Done button
  $('body').on(
    'click',
    '.doneButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      let taskId = Number(
        $(ev.target
          .closest('.doneButton'))
            .data('taskid')
      )
      let task = taskStore.getById(taskId)

      changeTaskStatus(
        taskId,
        'done'
      )

      updateView()
    }
  )

  // wire up revert button
  $('body').on(
    'click',
    '.revertButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      let taskId = Number(
        $(ev.target
          .closest('.revertButton'))
            .data('taskid')
      )

      changeTaskStatus(
        taskId,
        'new'
      )
    }
  )

  //reset filter
  $('#resetFilter').on(
    'click',
    (ev) => {
      $('#earliestCreationDate').val('')
      $('#latestCreationDate').val('')
      $('#earliestDueDate').val('')
      $('#latestDueDate').val('')

      appStore.changeFilters({
        creationTime: undefined,
        dueTime: undefined
      })

      handleFilter()
    }
  )

  // wire up Edit Task modal
  $('body').on(
    'click',
    '.editButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      handleCreateEditTask(
        Number(
          $(ev.target
            .closest('.editButton'))
              .data('taskid')
        )
      )
      $('#taskCreateEdit').modal('show')

      setTimeout(() => {
        $('body').addClass('modal-open')
      }, 500)
    }
  )
  // delete task functionality
  $('body').on(
    'click',
    '.deleteButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
       let retVal = confirm("Do you really want to delete this task?");
      retVal==true?
          deleteTask(
            Number(
              $(ev.target
              .closest('.deleteButton'))
                .data('taskid')
            )
          ):''
    })
  // toggle In Progress state
  $('body').on(
    'click',
    '.progressButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      let taskId = Number(
        $(ev.target)
        .parent()
        .parent()
        .get(0)
        .id.substring(4)
      )
      let task = taskStore.getById(taskId)

      changeTaskStatus(
        taskId,
        task && task.status === 'new'
        ? 'doing'
        : 'new'
      )
    }
  )
  // accept task appeal
  $('body').on(
    'click',
    '.acceptButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()

      let taskId = Number(
        $(ev.target
        .closest('.acceptButton'))
          .data('taskid')
      )
      let task = taskStore.getById(taskId)

      updateTask({
          ...task,
          appeal: false
      })
    })
  // reject task appeal
  $('body').on(
    'click',
    '.rejectButton',
    (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
      deleteTask(
        Number(
          $(ev.target
          .closest('.rejectButton'))
            .data('taskid')
        )
      )
    })
  // task search functionality
  $('#search').on(
    'keydown keyup',
    (ev) => {
      appStore.changeFilters({ name: ev.target.value })
      handleFilter()
    }
  )


  $('.creationDateFilterInputs').on(
    'change',
    (ev) => {
      if($('#earliestCreationDate').val() && $('#latestCreationDate').val()) {
        appStore.changeFilters({
          creationTime : {
            earliestTime: moment($('#earliestCreationDate').val(), 'DD.MM.YYYY')
              .valueOf(),
            latestTime: moment($('#latestCreationDate').val(), 'DD.MM.YYYY')
              .endOf('day').valueOf()
          }
        })

        handleFilter()
      }
    }
  )

  $('.dueDateFilterInputs').on(
    'change',
    (ev) => {
      if($('#earliestDueDate').val() && $('#latestDueDate').val()) {
        appStore.changeFilters({
          dueTime : {
            earliestTime: moment($('#earliestDueDate').val(), 'DD.MM.YYYY')
              .valueOf(),
            latestTime: moment($('#latestDueDate').val(), 'DD.MM.YYYY')
              .endOf('day').valueOf()
          }
        })

        handleFilter()
      }
    }
  )

  // wire up sign out button
  $('#sign-out-button').on(
    'click',
    (ev) => singOut()
  )

  $('#createUserButton').on(
    'click',
    (ev) =>{
      appStore.setPage('new-user')

      $('.taskWrapper').remove()
      $('.newUserPage').remove()
      $('.page').remove()
      createNewUser()
      wireUpNewUser()
    }
  )

  $('#currUser').html(getUsername())

  $(window).resize(() => {
    updateView()
  })
}

function handleDatePicker() {
  $('.creationDateFilterInputs').datepicker({
    format: 'dd.mm.yyyy',
    daysOfWeekHighlighted: "0,6",
    todayHighlight: true
  })

  $('.dueDateFilterInputs').datepicker({
    format: 'dd.mm.yyyy',
    daysOfWeekHighlighted: "0,6",
    todayHighlight: true
  })
}
