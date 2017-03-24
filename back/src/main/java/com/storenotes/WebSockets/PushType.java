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
public enum PushType {
    CREATE("create"), UPDATE("update"), DELETE("delete");
    
    private String name;
    
    private PushType(String name) {
        this.name = name;
    }
    
    public String getName() {
        return this.name;
    }
}
