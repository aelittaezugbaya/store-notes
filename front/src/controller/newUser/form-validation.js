/* @flow */
'use strict'

import $ from 'jquery'

export function validateForm (): boolean {
  let passValid = handlePasswords()
  let emailValid = handleEmail()

  return passValid && emailValid
}

export function bindValidation () {
  $('#password-repeat').on('focus', (ev) => {
    $(ev.target).parent().addClass('has-feedback')
  })

  $('#password-repeat, #password').on('keyup keydown', (ev) => {
    $('#passVal').remove()
    if (handlePasswords(false)) {
      $('#password-repeat').parent().removeClass('has-error')
      $('#password-repeat').parent().addClass('has-success')
      $('#password-repeat').before($('<i id="passVal" class="fa fa-check" aria-hidden="true"></i>'))
      $('#passVal').css({ 'color': 'green' })
    } else {
      $('#password-repeat').parent().removeClass('has-success')
      $('#password-repeat').parent().addClass('has-error')
      $('#password-repeat').before($('<i id="passVal" class="fa fa-times" aria-hidden="true"></i>'))
      $('#passVal').css({ 'color': 'red' })
    }
  })

  $('#email').popover({
    'trigger': 'manual',
    'content': '<i class="inPopover fa fa-exclamation-circle fa-lg"></i>Please, input actual email!',
    'placement': 'top',
    'html': true
  })

  $('input').on('focus', (ev) => {
    $(ev.target).popover('hide')
    $(ev.target).removeClass('has-error')
  })
}

function handlePasswords (showPopover?: boolean = true): boolean {
  if ($('#password').val() !== $('#password-repeat').val() || $('#password').val() === '') {
    if (showPopover) {
      showPasswordPopover()
    }
    $('#password-repeat').addClass('has-error')
    return false
  }

  return true
}

function showPasswordPopover () {
  if ($('#password').val() !== $('#password-repeat').val()) {
    $('#password-repeat').popover({
      'trigger': 'manual',
      'content': '<i class="inPopover fa fa-exclamation-circle fa-lg"></i>Passwords do not match!',
      'placement': 'top',
      'html': true
    })
    $('#password-repeat').popover('show')
  } else {
    $('#password').popover({
      'trigger': 'manual',
      'content': '<i class="inPopover fa fa-exclamation-circle fa-lg"></i>This field cannot be empty!',
      'placement': 'top',
      'html': true
    })
    $('#password').popover('show')
  }
}

function handleEmail (): boolean {
  if (!validateEmail($('#email').val())) {
    showEmailPopover()
    $('#email').addClass('has-error')
    return false
  }

  return true
}

function showEmailPopover () {
  $('#email').popover('show')
}

function validateEmail (email: string): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}
