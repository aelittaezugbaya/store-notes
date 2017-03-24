/* @flow */
'use strict'

import $ from 'jquery'

export function displayAuthComponent () {
  /*
  let html = '<div class="header"></div>' +
  '<div class="container">' +
    '<div class="panel panel-default">' +
        '<form>' +
          '<div class="form-group">' +
           '<label for="username">Username:</label>' +
           '<input type="text" class="form-control" id="username">' +
          '</div>' +
          '<div class="form-group">' +
           '<label for="pwd">Password:</label>' +
           '<input type="password" class="form-control" id="pwd">' +
          '</div>' +
          '<button type="submit" class="btn btn-default" id="submitAuth">Submit</button>' +
        '</form>' +
    '</div>' +
  '</div>'
  */
  let html =
  '<div class="login-page">' +
	  '<div class="form">' +
	  '<img src="../public/img/lidl.png" alt="Lidl">' +
		'<form class="login-form">' +
		  '<input id="username" style="text-indent:30px;" type="text" placeholder="username"/>' +
		  '<input id="pwd" style="text-indent:30px;" type="password" placeholder="password"/>' +
		  '<button id="submitAuth">Sign in</button>' +
		'</form>' +
	  '</div>' +
	'</div>'

  $('body').html(html).css({
    'background-color': '#2250A9' /* fallback for old browsers */
  })
}
