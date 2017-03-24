/* @flow */
'use strict'

import $ from 'jquery'
import moment from 'moment'

import { List } from 'immutable'

import { taskStore } from '../store'

export function handleProgressBars () {
  $('.custom-progress-bar').each((index) => {
    handleProgressBar($($('.custom-progress-bar').get(index)))
  })
}

export function handleLastProgressBar () {
  // console.log($('.custom-progress-bar').last(), $('.custom-progress-bar').last().get(0))
  if ($('.custom-progress-bar').last().get(0)) {
    handleProgressBar($('.custom-progress-bar').last())
  }
}

function handleProgressBar ($progressBar: any) {
  let id = Number($progressBar.prev().get(0).id.substring(4))
  let task = taskStore.getById(id)

  if (task) {
    let dueTime = task.dueTime
    let creationTime = task.creationTime

    if (dueTime) {
      let diff = Math.min((moment().valueOf() - moment(creationTime).valueOf()) /
      (dueTime - moment(creationTime).valueOf()), 1) * 100

      $progressBar.css({
        'position': 'absolute',
        'left': '0%',
        'top': '92%',
        'height': '8%',
        'width': diff + '%',
        'background-color': diff < 50
        ? 'green'
        : diff < 80
          ? 'yellow'
          : diff < 95
            ? 'orange'
            : 'red',
        'opacity': '0.9'
      })
    }
  }
}
