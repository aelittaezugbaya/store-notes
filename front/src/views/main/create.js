/* @flow */
'use strict'

import $ from 'jquery'

import moment from 'moment'


import {
  assembleTask,
  uploadTask
} from '../../controller/create'

import {
  employeeStore,
} from '../../controller/store'

import {
  getEmployees,
} from '../../core/ajax'

import {
  timeToString,
  timeToStringShort,
  timeToStringDate,
  timeToStringTime
} from '../../core/time'

import type { Task } from '../../types'

export function displayCreateEditComponent (
  task?: Task
) {
  let html = '<div class="modal-content">' +
  '<form autocomplete="off" id="createUpdateForm">' +
      '<div class="modal-header">' +
    '      <button type="button" class="close" data-dismiss="modal">&times;</button>' +
    '      <h4 class="modal-title">Add Task</h4>' +
    '  </div>' +
  '    <div class="modal-body">' +
        '<div class="form-group">' +
               '<label for="premadeTasks">Choose premade task:</label>' +
               '<div class="input-group dropdown">' +
                  '<input id="premadeTasks" class="dropdown-toggle form-control" placeholder="Common tasks.." type="text" data-toggle="dropdown" value="' + (task ? task.name : '') + '" >' +
                  '<div class="input-group-btn">' +
                    '<button class="btn btn-default" type="reset">' +
                      '<i class="fa fa-times" aria-hidden="true"></i>' +
                  ' </button>' +
                  '</div>' +
                  '<ul class="dropdown-menu" id="premadeTasksList">' +

                  '</ul>' +
               '</div>' +
           '</div>' +
           '<hr>'+
          '  <div class="form-group">' +
                '<label for="task-name">Task:</label>' +
                   '<input id="name" class="form-control" type="text" placeholder="Name of the task" value="' + (task ? task.name : '') + '"  required>' +
            '</div>' +
              '<div class="form-group">' +
                '  <label for="description">Description</label>' +
                '  <textarea class="form-control" id="description" placeholder="Please write more about the task.." required >' + (task ? task.description : '') + '</textarea>' +
            '  </div>' +
              '<div class="form-group">' +
                  '<label for="due-time">Due time</label>' +
                  '<div class="input-group date">' +
                    '<input type="text" class="form-control"  value="' +
                    (task && task.dueTime !== 0
                      ? timeToStringDate(task.dueTime)
                      : moment().format("DD.MM.YYYY")) + '"id="datePicker"' +
                      (task && task.dueTime === 0
                        ? 'disabled'
                        : '') + '>' +
                    '<span class="input-group-addon">' +
                      '<i class="fa fa-calendar" aria-hidden="true"></i>' +
                    '</span>' +
                  '</div>' +
                '  <div class="input-group bootstrap-timepicker timepicker">' +
                      '<input id="timePicker" type="text" class="form-control input-small" '+(task && task.dueTime===0 ?'disabled':'')+' value="'+(task && task.dueTime !==0 ? timeToStringTime(task.dueTime):moment().endOf("day").format("LT"))+'">' +
                      '<span class="input-group-addon"><i class="fa fa-clock-o" aria-hidden="true"></i></span>' +
                  '</div>' +
                  '<div class="form-group checkbox">' +
                        '<label><input type="checkbox" id="noDueDate"'+(task && task.dueTime === 0 ?'checked' : '' )+'>No Due Time</label>'+
                  '</div>' +
            '  </div>' +
            '  <div class="form-group">' +
                  '<label for="employees">Employees</label>' +
                  '<select multiple class="form-control" id="employees">' +
                  '</select>' +
                  '<label><input type="checkbox" id="allEmployees">All</label>' +
              '</div>' +
            '  <div class="form-group">' +
                  '<label for="section">Location</label>' +
                  '<select class="form-control" id="section" value="' + (task && task.section ? task.section.id : 1) + '">' +
                '  </select>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                    '<label><input type="checkbox" class="urgent" ' + (task && task.urgent ? 'checked' : '')+ '>Urgent</label>' +'</div>' +
              '<div class="form-group checkbox">' +
                	'<label><input type="checkbox" class="appeal" ' + (task && task.appeal ? 'checked' : '')+ '>Appeal</label>' +'</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '  <div class="btn-group">' +
              '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
              '<button type="submit" class="btn btn-success" id="createUpdateButton">' + (task ? 'Edit' : 'Create') + '</button>' +
          '</div>' +
    '  </div>' +
    '</form>' +
  '</div>'

  $('#taskCreateEdit').html(html)
}
