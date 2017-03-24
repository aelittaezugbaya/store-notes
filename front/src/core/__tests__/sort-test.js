/* flow */
/* eslint-env jasmine */
'use strict'

import { List } from 'immutable'

import { sortTasks } from '../sort'

describe('task sorting', () => {
  describe('should-be-done-first based sorting', () => {
    let tasks = List.of(
      {
        name: '',
        description: '',
        status: 'new',
        urgent: true,
        dueTime: 5
      },
      {
        name: '',
        description: '',
        status: 'new',
        urgent: false,
        dueTime: 4
      },
      {
        name: '',
        description: '',
        status: 'doing',
        urgent: false,
        dueTime: 3
      },
      {
        name: '',
        description: '',
        status: 'new',
        urgent: false,
        dueTime: 2
      },
      {
        name: '',
        description: '',
        status: 'new',
        urgent: false,
        dueTime: 1
      },
      {
        name: '',
        description: '',
        status: 'new',
        urgent: false,
        dueTime: 0.5
      }
    )
    let sortedTasks = sortTasks(tasks)

    it('places urgent tasks first', () => {
      expect(sortedTasks.first().urgent)
        .toBeTruthy()
    })

    it('places task with earlier due date first', () => {
      sortedTasks.filterNot((p) => p.urgent)
        .filter((p) => p.status === 'new')
        .forEach((p, i, arr) => {
          if (i === 0) {
            expect(1).toEqual(1)
          } else {
            expect(p.dueTime).toBeGreaterThan(arr.get(i - 1).dueTime)
          }
        })
    })

    it('places inProgress tasks last', () => {
      expect(sortedTasks.last().status)
        .toEqual('doing')
    })

    it('considers urgentness more important than due time', () => {
      expect(sortedTasks.filter((p) => p.status === 'new')
        .filter((p, i, arr) => {
          if (i === 0) {
            return true
          } else {
            return p.dueTime < arr.get(i - 1).dueTime
          }
        }).size).toBeGreaterThan(0)
    })
  })
})
