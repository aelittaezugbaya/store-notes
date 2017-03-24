/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.xml.bind.DatatypeConverter;

/**
 *
 * @author aleksandr
 */
public class PasswordHasher {
    
    public static String hashPassword(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] passwordHash = digest
                .digest(
                        password
                                .getBytes(StandardCharsets.UTF_8)
                );
        String hashedPasswordString = DatatypeConverter.printHexBinary(
                passwordHash
        ).toLowerCase();
        
        return hashedPasswordString;
    }
}
