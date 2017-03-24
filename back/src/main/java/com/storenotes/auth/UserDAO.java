/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.auth;

import com.storenotes.db.AbstractUserDAO;

/**
 *
 * @author aleksandr
 */
public class UserDAO extends AbstractUserDAO<User> {
    
    public UserDAO() {
        super(User.class);
    }

    @Override
    public User updateFields(User updatable, User newObject) {
        // updatable.setEnabled(newObject.isEnabled());
        updatable.setEmail(newObject.getEmail());
        // updatable.setPassword(newObject.getPassword());
        updatable.setUsername(newObject.getUsername());
        
        return updatable;
    }
}
