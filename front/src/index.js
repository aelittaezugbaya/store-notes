/* @flow */
'use strict'

import $ from 'jquery'

import bootstrap from 'bootstrap'; // eslint-disable-line
import datepicker from 'bootstrap-datepicker'; // eslint-disable-line
import timepicker from 'bootstrap-timepicker'; // eslint-disable-line

import {
  initAuth
} from './core/auth'
import {
  initWebSocket as startTaskWebSocket
} from './core/websockets/taskWebSocket'
import {
  initWebSocket as startEmployeeWebSocket
} from './core/websockets/employeeWebSocket'

// $FlowIgnore
import 'url!bootstrap/dist/css/bootstrap.min.css'
// $FlowIgnore
import 'url!bootstrap/dist/css/bootstrap-theme.min.css'
// $FlowIgnore
import 'url!bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'
// $FlowIgnore
import 'url!bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
// $FlowIgnore
import 'url!bootstrap/dist/fonts/glyphicons-halflings-regular.woff'
// $FlowIgnore
import 'url!bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'

// $FlowIgnore
import 'url!font-awesome/css/font-awesome.min.css'
// $FlowIgnore
import 'url!font-awesome/fonts/fontawesome-webfont.woff2'
// $FlowIgnore
import 'url!font-awesome/fonts/fontawesome-webfont.woff'
// $FlowIgnore
import 'url!font-awesome/fonts/fontawesome-webfont.ttf'

// $FlowIgnore
import 'url!roboto-fontface/css/roboto/roboto-fontface.css'
// $FlowIgnore
import 'url!roboto-fontface/fonts/Roboto/Roboto-Regular.woff2'
// $FlowIgnore
import 'url!roboto-fontface/fonts/Roboto/Roboto-Regular.woff'
// $FlowIgnore
import 'url!roboto-fontface/fonts/Roboto/Roboto-Regular.ttf'

// $FlowIgnore
import 'url!../public/img/lidl.png'
// $FlowIgnore
import 'url!../public/img/username.png'
// $FlowIgnore
import 'url!../public/img/password.png'

$(document).ready(() => {
  // $FlowIgnore
  if (Notification.permission !== "granted") {
    Notification.requestPermission()
  }

  initAuth()
  startTaskWebSocket()
  startEmployeeWebSocket()
})
