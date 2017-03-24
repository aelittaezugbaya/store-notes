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
public class PushNotification {
    private Object object;
    private PushType type;
    private ActionInitiator initiator;
    
    public PushNotification(PushType type) {
        this(type, null);
    }
    
    public PushNotification(PushType type, Object object) {
        this(type, object, null);
    }
    
    public PushNotification(PushType type, Object object, ActionInitiator initiator) {
        this.type = type;
        this.object = object;
        this.initiator = initiator;
    }
    
    public void setInitiator(ActionInitiator initiator) {
        this.initiator = initiator;
    }
    public ActionInitiator getInitiator() {
        return this.initiator;
    }
    
    public void setPushType(PushType type) {
        this.type = type;
    }
    public PushType getPushType() {
        return this.type;
    }
    
    public void setObject(Object object) {
        this.object = object;
    }
    public Object getObject() {
        return this.object;
    }
}
