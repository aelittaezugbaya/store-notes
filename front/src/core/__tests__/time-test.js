/* eslint-env jasmine */
'use strict'

import {
  timeToStringShort,
  timeToStringDate,
  timeToStringTime,
  stringToTime
} from '../time'

describe('time-related functionality', () => {
  describe('parse', () => {
    it('parses a string representation of time to number', () => {
      expect(stringToTime('09.02.1998', 'DD.MM.YYYY').valueOf())
        .toEqual(886975200000)
    })

    it('retrieves a string representation of time out of number', () => {
      expect(timeToStringTime(1232154)).toEqual('2:20 AM')
    })

    it('retrieves a string representation of date out of number', () => {
      expect(timeToStringDate(1232154)).toEqual('01.01.1970')
    })

    it('retrieves a string representation of datetime out of number', () => {
      expect(timeToStringShort(1232154)).toEqual('02:20, 1.01.1970')
    })
  })
})
