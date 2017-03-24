/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import {
  getRole,
  getUsername
} from '../../core/auth'

import {
  getEmployeesByTaskId
} from '../../controller/details'

import {
  start
} from '../../controller/main'

import{
  employeeListToString
} from './details'

import {
  employeeStore,
} from '../../controller/store'

import {
  getEmployeeByUsername
} from '../../core/ajax'

import {
  timeToString,
  timeToStringShort
} from '../../core/time'

import type {
  Task
} from '../../types'

export function createTaskComponent (task: Task) {
  let assignees = employeeStore.getEmployees()
    .filter((e) =>
      e.tasks.filter((t) => t.id === task.id).size !== 0
    )

  let html =
  '<a href="#task' + task.id + '" class="list-group-item clearfix taskWrapper" id="task' + task.id + '">' +

    '<div class="col-lg-' + (task.appeal ? 3  : 3) + '">' +
      '<div class="task">' +
        (task.urgent
          ?'<i class="fa fa-exclamation-circle fa-lg"></i>' + '<b style="position:relative; right:15px;">' + task.name + '</b>'
          :'<b>' + task.name + '</b>') +
      '</div>' +
    '</div>' +
    (!task.appeal
    ? (
    '<div class="col-lg-2">' +
      '<span>' +
        `${ assignees.size !== 0 ? employeeListToString(getEmployeesByTaskId(task.id)) : 'no assignees'}` +
     '</span>' +
    '</div>' +
    '<div class="col-lg-3">' +
      '<span> '+` Deadline: ${task.dueTime===0 ? 'No Deadline' :timeToStringShort(task.dueTime)}`+'</span>' +
    '</div>' +
    '<div class="col-lg-2">' +
      (task.status === 'doing'
      ? '<div class="text-danger progressButton">Revert To New</div>'
      : '<button class="btn btn-default progressButton" type="button">In Progress</button>') +
    '</div>' +

    '<div class="col-lg-2 btnWrapperOuter" id="task' + task.id + '">' +
      '<div class="btn-group btnWrapperInner">' +
        '<button class="btn btn-success task-buttons doneButton" data-taskid="'+task.id+'"><i class="fa fa-check"></i></button>' +
        '<button class="btn btn-warning task-buttons editButton" data-taskid="'+task.id+'">' +
            '<i class="fa fa-pencil"></i>' +
        '</button>' +
        '<button class="btn btn-danger task-buttons deleteButton" data-taskid="'+task.id+'"><i class="fa fa-times"></i></button>' +
      '</div>' +
     '</div>'
//       '<div id="task' + task.id + '"></div>'
      )
      : (
        '<div class="col-lg-2">' +
        '<span>' +
          `${ assignees.size !== 0 ? employeeListToString(getEmployeesByTaskId(task.id)) : 'no assignees'}` +
        '</div>' +
        '<div class="col-lg-5">' +
          '<span>' +` Deadline: ${ task.dueTime===0 ? 'No Deadline' : timeToStringShort(task.dueTime)}` + '</span>' +
        '</div>' +
        '<div class="col-lg-2 btnWrapperOuter" id="task' + task.id + '">' +
          '<div class="btn-group btnWrapperInner">' +
            '<button class="btn btn-success task-buttons acceptButton" type="button" data-taskid="' + task.id + '">Accept</button>' +
            '<button class="btn btn-danger task-buttons rejectButton" type="button" data-taskid="' + task.id + '">Reject</button>' +
          '</div>' +
         '</div>'
      )) +
      '<div class="custom-progress-bar"></div>' +
    '</a>'

    $('#taskList').append(html)

    // button styles

    if (window.innerWidth >= 520) {
      $('.btnWrapperOuter').css({
        'height': '91%',
        'position': 'absolute',
        'bottom': '9%',
        'right': '0%',
        'width': '21%'
      })
      $('.btnWrapperInner').css({
        'height': '100%',
        'position': 'absolute',
        'right': '0%',
        'width': '100%'
      })
      $('.task-buttons').css({
        'height': '100%'
      })
      $('.deleteButton').css({
        'position': 'absolute',
        'right': '0%',
        'top': '0%',
        'height': '100%',
        'width': '33%'
      })
      $('.editButton').css({
        'position': 'absolute',
        'right': '33%',
        'top': '0%',
        'height': '100%',
        'width': '33%'
      })
      $('.doneButton').css({
        'position': 'absolute',
        'right': '66%',
        'top': '0%',
        'height': '100%',
        'width': '33%'
      })
      $('.rejectButton').css({
        'position': 'absolute',
        'right': '0%',
        'top': '0%',
        'height': '100%',
        'width': '50%'
      })
      $('.acceptButton').css({
        'position': 'absolute',
        'right': '50%',
        'top': '0%',
        'height': '100%',
        'width': '50%'
      })
    } else {
      $('.btnWrapperOuter').css({
        'height': '20%',
        'position': 'absolute',
        'bottom': '9%',
        'right': '0%',
        'width': '100%'
      })
      $('.btnWrapperInner').css({
        'height': '100%',
        'position': 'absolute',
        'right': '0%',
        'width': '100%'
      })
      $('.task-buttons').css({
        'height': '100%'
      })
      $('.deleteButton').css({
        'position': 'absolute',
        'right': '0%',
        'top': '0%',
        'height': '100%',
        'width': '33%'
      })
      $('.editButton').css({
        'position': 'absolute',
        'right': '33%',
        'top': '0%',
        'height': '100%',
        'width': '33%'
      })
      $('.doneButton').css({
        'position': 'absolute',
        'right': '66%',
        'top': '0%',
        'height': '100%',
        'width': '33%'
      })
      $('.rejectButton').css({
        'position': 'absolute',
        'right': '0%',
        'top': '0%',
        'height': '100%',
        'width': '50%'
      })
      $('.acceptButton').css({
        'position': 'absolute',
        'right': '50%',
        'top': '0%',
        'height': '100%',
        'width': '50%'
      })
      $('.progressButton').css({
        'margin-bottom': '30%'
      })
    }
 }

export function createCompletedTaskComponent (task: Task) {
  let html =
     '<a href="#task' + task.id + '" class="list-group-item list-group-item-success clearfix taskWrapper" id="task' + task.id + '">' +
       '<div class="col-md-10">' +
         '<div class="task">' +
           '<b>' + task.name + '</b>' +
         '</div>' +
       '</div>' +
       '<div class="col-md-1 btnWrapperOuterLeft">' +
         '<div class="btn-group btnWrapperInner">' +
           '<button class="btn btn-primary task-buttons revertButton"' +
           'type="button" data-taskid="'+task.id+'">Revert</button>' +
         '</div>' +
       '</div>' +
       '<div class="col-md-1 btnWrapperOuterRight">' +
         '<div class="btnWrapperInner">' +
           '<button class="btn btn-danger task-buttons deleteButton"' +
           'type="button" data-taskid="'+task.id+'"><i class="fa fa-times"></i></button>' +
         '</div>' +
       '</div>' +
  '</a>'

  $('#taskList').append(html)
  // button styles

  if (window.innerWidth >= 520) {
    $('.btnWrapperOuterLeft').css({
      'height': '100%',
      'position': 'absolute',
      'bottom': '0%',
      'right': '11%',
      'width': '11%'
    })
    $('.btnWrapperOuterRight').css({
      'height': '100%',
      'position': 'absolute',
      'bottom': '0%',
      'right': '0%',
      'width': '11%'
    })
    $('.btnWrapperInner').css({
      'height': '100%',
      'position': 'absolute',
      'right': '0%',
      'width': '100%'
    })
    $('.task-buttons').css({
      'height': '100%'
    })
    $('.revertButton').css({
      'position': 'absolute',
      'right': '25%',
      'top': '0%',
      'height': '100%',
      'width': '100%'
    })
    $('.deleteButton').css({
      'position': 'absolute',
      'right': '0%',
      'top': '0%',
      'height': '100%',
      'width': '100%'
    })
  } else {
    $('.taskWrapper').css({
      'padding-bottom': '10%'
    })
    $('.btnWrapperOuterLeft').css({
      'height': '20%',
      'position': 'absolute',
      'bottom': '9%',
      'right': '50%',
      'width': '50%',
      'padding-bottom': '8%'
    })
    $('.btnWrapperOuterRight').css({
      'height': '20%',
      'position': 'absolute',
      'bottom': '9%',
      'right': '0%',
      'width': '50%',
      'padding-bottom': '8%'
    })
    $('.btnWrapperInner').css({
      'height': '140%',
      'position': 'absolute',
      'right': '0%',
      'width': '100%'
    })
    $('.task-buttons').css({
      'height': '140%'
    })
    $('.revertButton').css({
      'position': 'absolute',
      'right': '0%',
      'top': '0%',
      'height': '100%',
      'width': '100%'
    })
    $('.deleteButton').css({
      'position': 'absolute',
      'right': '0%',
      'top': '0%',
      'height': '100%',
      'width': '100%'
    })
  }
}

export function createNewUser () {
  let html = '<div class="row form-group newUserPage">' +
        '<div class="col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>' +
        '<div class="col-lg-6 col-md-8 col-sm-10 col-xs-12">' +
         '<form autocomplete="new-password">' +
            '<button id="returnButton" class="btn btn-default">Back</button>'+
            '<hr>'+
            '<div class="form-group">'+
              '<label for="firstName">First Name: </label>' +
              '<input id="firstName" class="form-control" placeholder="John" type="text" >' +
            '</div>' +
            '<div class="form-group">'+
              '<label for="lastName">Last Name: </label>' +
              '<input id="lastName" class="form-control" placeholder="Doe" type="text" >' +
            '</div>' +
            '<div class="form-group">'+
              '<label for="usernameInput">Username: </label>' +
              '<input id="usernameInput" autocomplete="off" class="form-control" placeholder="johnDoe97" type="text" >' +
            '</div>' +
            '<div class="form-group">'+
              '<label for="pwd">Password: </label>' +
              '<input id="password" autocomplete="new-password" class="form-control" placeholder="******" type="password" >' +
            '</div>' +
            '<div class="form-group">'+
              '<label for="pwd">Repeat password: </label>' +
              '<input id="password-repeat" autocomplete="new-password" class="form-control" placeholder="******" type="password" >' +
            '</div>' +
            '<div class="form-group">'+
              '<label for="firstName">Rank </label>' +
              '<select id="rank" class="form-control">' +
                '<option value="WORKER">Worker</option>' +
                '<option value="MANAGER">Manager</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-group">'+
              '<label for="email">Email: </label>' +
              '<input id="email" class="form-control" placeholder="johnDoe97@example.com" type="email" >' +
            '</div>' +
            '<div class="form-group pull-right btn-group">'+
              '<button id="cancelButton" class="btn btn-default " type="reset">Cancel</button>'+
              '<button class="btn btn-success" id="createNewUserButton">Create</button>'+
            '</div>'+
         '</form>' +
        '</div>' +
     '</div>'
  $('.main').append(html);
}

export function createMainViewComponent () {
  let html = '<div class="header">' +
    '<span id="sign-out-button">sign out <i class="fa fa-sign-out fa-l" aria-hidden="true"></i></span>' +
    '<span id="currUser"></span>' +
    '<span id="createUserButton">create new user <i class="fa fa-user-plus fa-l" aria-hidden="true"></i></span>' +
  '</div>' +
  '<img class="mainView" src="../public/img/lidl.png" />' +
  '<div class="container main">' +
    '<div class="page">'+
    '<ul class="nav nav-tabs" id="main-nav">' +
      '<li class="active" id="nav-tab-task-list"><a href="#" id="showTasks">Task List</a></li>' +
      '<li id="nav-tab-completed-tasks"><a href="#" id="showCompleted">Show Completed</a></li>' +
    '</ul>' +
    '<h3></h3>' +
    '<div class="form-inline">' +
    '<div class="input-group">' +

      '<div class="dropdown">'+
          '<button id ="employeeDropdown" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">All employees ' +
            '<span class="caret"></span>' +
          '</button>' +
          '<ul class="dropdown-menu"  id="employeeFilter">' +
          '</ul>' +
      '</div>' +
      '<span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>' +

      '<div class="dropdown">' +
          '<button id="sectionDropdown" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">All sections ' +
            '<span class="caret"></span>' +
          '</button>' +
          '<ul class="dropdown-menu"  id="sectionFilter">' +
          '</ul>' +
     '</div>' +
      '<span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>'+
    '</div>' +
    '<div class="input-group">' +
      '<div class="dropdown">' +
        '<button class="btn btn-default btn-sm dropdown-toggle " type="button" data-toggle="dropdown">By Creation Date ' +
        '<span class="caret"></span></button>' +
        '<ul class="dropdown-menu" id="creationDateFilter">' +
          '<li>' +
            '<a class="datepicker">' +
              '<label for="earliestDate">Since:</label> <input type="text" class="form-control creationDateFilterInputs" id="earliestCreationDate" >' +
            '</a>' +
          '</li>' +
          '<li>' +
            '<a class="input-group datepicker">' +
              '<label for="latestDate">Till:</label><input type="text" class="form-control  creationDateFilterInputs" id="latestCreationDate">' +
            '</a>' +
          '</li>' +
        '</ul>'+
      '</div>'+
      '<span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>'+
      '<div class="dropdown">' +
        '<button class="btn btn-default btn-sm dropdown-toggle " type="button" data-toggle="dropdown">By Due Date '+
        '<span class="caret"></span></button>' +
        '<ul class="dropdown-menu" id="dueDateFilter">' +
          '<li>' +
            '<a class="datepicker">' +
              '<label for="earliestDate">Since:</label> <input type="text" class="form-control dueDateFilterInputs" id="earliestDueDate" >' +
            '</a>' +
          '</li>' +
          '<li>' +
            '<a class="input-group datepicker">' +
              '<label for="latestDate">Till:</label><input type="text" class="form-control  dueDateFilterInputs" id="latestDueDate">' +
            '</a>' +
          '</li>' +
        '</ul>'+
      '</div>'+
      '<span class="input-group-addon" style="width:0px; padding-left:0px; padding-right:0px; border:none;"></span>'+
      '<button class="btn btn-sm btn-default" id="resetFilter">Reset Dates</button>' +
    '</div>' +
    '</div>' +
    '<div class="input-group">' +
      '<input type="text" class="form-control" placeholder="Search" id="search">' +
      '<div class="input-group-btn">' +
        '<button class="btn btn-default" type="submit">' +
          '<i class="fa fa-search" aria-hidden="true"></i>' +
      ' </button>' +
      '</div>' +
    '</div>' +
     '<div class="list-group tasks" id="taskList">' +
         '<a href="#" id="addTaskButton" class="list-group-item">' +
             '<i class="fa fa-plus"></i> <b>Add Task</b>' +
         '</a>' +
     '</div>'+
'  </div>' +
  '<div id="taskDetails" class="modal fade" role="dialog">' +
          '<div class="modal-dialog">' +
          '</div>' +
  '</div>' +
  '<div id="taskCreateEdit" class="modal fade" role="dialog" >' +
          '<div class="modal-dialog">' +
          '</div>' +
    '</div>'+
  '</div>'

  $('body').html(html).css({
    'background-color': 'white'
  })
}
