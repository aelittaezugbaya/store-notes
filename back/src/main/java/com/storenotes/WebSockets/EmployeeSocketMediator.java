/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.WebSockets;

import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author aleksandr
 */
@ServerEndpoint("/employeesSocket/{client-id}")
public class EmployeeSocketMediator extends AbstractSocketMediator {
    
}
