/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.auth;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author aleksandr
 */
public class PasswordHasherTest {
    
    public PasswordHasherTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
    }
    
    @After
    public void tearDown() {
    }

    /**
     * Test of hashPassword method, of class PasswordHasher.
     */
    @Test
    public void theSameInputShouldResultInTheSameOutput() throws Exception {
       assertEquals(
               PasswordHasher.hashPassword("123456"),
               PasswordHasher.hashPassword("123456")
       );
    }
    
    
    @Test
    public void theDifferentInputShouldResultInDifferentOutput() throws Exception {
       assertNotEquals(
               PasswordHasher.hashPassword("123455"),
               PasswordHasher.hashPassword("123456")
       );
    }
}
