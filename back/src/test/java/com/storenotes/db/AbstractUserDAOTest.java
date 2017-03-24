/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.auth.User;
import com.storenotes.auth.UserDAO;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
import com.storenotes.util.HibernateStuff;
import java.util.Iterator;
import org.hibernate.Session;
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
public class AbstractUserDAOTest {
    UserDAO dao;
    
    public AbstractUserDAOTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {       
        dao = new UserDAO();
        
        for (User user : dao.getAll()) {
            dao.delete(user.getUsername());
        } 
        
        User sample = new User();
        sample.setUsername("sampleUsername");
                
        dao.add(sample);
    }
    
    @After
    public void tearDown() {   
        for (User user : dao.getAll()) {
            dao.delete(user.getUsername());
        }      
    }

    @Test
    public void shouldDeleteByUsername() {
        assertEquals(dao.getAll().size(), 1);
        
        for (User user : dao.getAll()) {
            dao.delete(user.getUsername());
        } 

        assertEquals(dao.getAll().size(), 0);
    }

    @Test
    public void shouldUpdateByUsername() {
        assertEquals(dao.getAll().size(), 1);
        
        for (User user : dao.getAll()) {
            user.setEmail("sampleEmail");
            dao.update(user.getUsername(), user);
        }

        for (User user : dao.getAll()) {
            assertEquals(user.getEmail(), "sampleEmail");
        }
    }

    @Test
    public void shouldRetrieveByUsername() {
       Iterator<User> iterator = dao.getAll().iterator();
       
       User user = iterator.next();
       
       assertEquals(
               user.getUsername(),
               dao.getByUsername(user.getUsername()).getUsername()
       );
    }
    
}
