/* @flow */
'use strict'

import $ from 'jquery'

import { List } from 'immutable'

import {
  timeToStringShort
} from '../../core/time'

import {
  getEmployeesByTaskId
} from '../../controller/details'

import type {
  Task,
  Employee
} from '../../types'

import {
  appStore
} from '../../controller/store'


export function displayDetails (
  task: Task
) {
  let html = '<div class="modal-content">' +
                  '<div class="modal-header">' +
                      '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                      '<h4 class="modal-title">' + task.name + '</h4>' +
                  '</div>' +
                  '<div class="modal-body">' +
                      '<h4>Description</h4>' +
                      '<p>' + task.description + '</p>' +
                      '<b>Creation time: </b><span id="creationTime">' +
                        timeToStringShort(task.creationTime) +
                        '</span><br>' +
                      '<b>Due time: </b><span id="dueTime">' +
                        (task.dueTime === 0
                          ? 'No Due Time'
                          : timeToStringShort(task.dueTime)) + '</span><br>' +
                      '<b>Location: </b><span id="section">' +
                        (task.section ? task.section.name : '') + '</span><br>' +
                    '  <b>Status: </b><span id="status">' +
                        (task.status ? task.status : '') + '</span><br>' +
                      '<b>Assignee(s): </b><span id="assignees">' +
                          employeeListToString(getEmployeesByTaskId(task.id)) + '</span>' +
                '  </div>' +


                  '<div class="modal-footer detailsFooter">' +

                  (appStore.getView() === 'current'
                  ?   (!task.appeal
                      ? ('<div class="btn-group">' +
                            '<button type="button" class="btn btn-success ' +
                              'doneButton" data-dismiss="modal" data-taskid="' +
                                task.id + '" >Done</button>' +
                            '<button type="button" class="btn btn-warning ' +
                              'editButton" data-dismiss="modal" data-taskid="' +
                                task.id + '">Edit</button>' +
                            '<button type="button" class="btn btn-danger ' +
                              'deleteButton" data-dismiss="modal" data-taskid="' +
                                task.id + '">Delete</button>' +
                      '  </div>')
                      : ('<div class="btn-group">' +
                            '<button type="button" class="btn btn-warning ' +
                              'editButton" data-dismiss="modal" data-taskid="' +
                                task.id + '">Edit</button>' +
                            '<button class="btn btn-success task-buttons ' +
                              'acceptButton" type="button" data-taskid="' +
                                task.id + '">Accept</button>' +
                            '<button class="btn btn-danger task-buttons ' +
                              'rejectButton" type="button" data-taskid="' +
                                task.id + '">Reject</button>' +
                      '</div>'))
                    : ('<div class="btn-group">' +
                        '<button class="btn btn-primary task-buttons ' +
                          'revertButton" type="button" data-taskid="' +
                            task.id + '">Revert</button>' +
                        '<button class="btn btn-danger task-buttons ' +
                          'deleteButton" type="button" data-taskid="' +
                            task.id + '">Delete</button>' +
                  '  </div>')) +
                '  </div>' +
              '</div>'

  $('#taskDetails').html(html)
}

export function employeeListToString (
  employees: List<Employee>
): string {
  return employees.map((e, i, arr) => e.name)
    .toArray()
    .join(', ')
    .trim()
}
