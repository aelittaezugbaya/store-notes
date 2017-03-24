/* @flow */
'use strict'

import moment from 'moment'

export function stringToTime (
  timeStamp: string,
  format: string,
  isTimeOnly?: boolean = false
): number {
  if (timeStamp === '') {
    return 0
  }

  return moment(timeStamp, format).valueOf() - (
    isTimeOnly
    ? moment('00:00', 'HH:mm')
    : 0
  )
}

export function timeToString (
  time: any
): string {
  let momentTime = moment(time)
/*
  let years = momentTime.year()
  let months = momentTime.month()
  let days = momentTime.days()
  let hours = momentTime.hours()
  let minutes = momentTime.minutes()
  let seconds = momentTime.seconds()
*/
  return momentTime.toString()
}

export function timeToStringShort(
  time: any
): string {
  let momentTime = moment(time)
/*
  let years = momentTime.year()
  let months = momentTime.month()
  let days = momentTime.days()
  let hours = momentTime.hours()
  let minutes = momentTime.minutes()
*/

  return momentTime.format("HH:mm, D.MM.YYYY")
}

export function timeToStringDate(
  time: any
): string {
  let momentTime = moment(time)
  return momentTime.format("DD.MM.YYYY")
}

export function timeToStringTime(
  time: any
): string {
  let momentTime = moment(time)
  return momentTime.format("LT")
}
