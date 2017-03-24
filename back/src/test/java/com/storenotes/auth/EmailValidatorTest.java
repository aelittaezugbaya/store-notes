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
public class EmailValidatorTest {
    
    public EmailValidatorTest() {
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
     * Test of validate method, of class EmailValidator.
     */
    @Test
    public void validEmailShouldPassTheTest() {
        assertTrue(EmailValidator.validate("terap98@icloud.com"));
    }
    
    @Test
    public void emailWithoutAtShouldFail() {
       assertFalse(EmailValidator.validate("terap98icloud.com"));
    }
    
    @Test
    public void emailWithoutDotShouldFail() {
       assertFalse(EmailValidator.validate("terap98@icloudcom"));
    }
    
    @Test
    public void tooShortEmailShouldFail() {
       assertFalse(EmailValidator.validate("t@q.c"));
    }
}
