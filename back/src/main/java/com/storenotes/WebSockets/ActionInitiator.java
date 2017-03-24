/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.WebSockets;

/**
 *
 * @author aleksandr
 */
public class ActionInitiator {
    private String username;
    
    public ActionInitiator() {
        this(null);
    }
    
    public ActionInitiator(String username) {
        this.username = username;
    }
    
    public String getUsername() {
        return this.username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
