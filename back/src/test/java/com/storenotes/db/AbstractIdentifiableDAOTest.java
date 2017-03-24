/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

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
public class AbstractIdentifiableDAOTest {
    TaskDAO dao;
    
    public AbstractIdentifiableDAOTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {       
        dao = new TaskDAO();
        for (Task task : dao.getAll()) {
            dao.delete(task.getId());
        }  
        
        Task sample = new Task();
        sample.setName("sample task");
        
        dao.add(sample);
    }
    
    @After
    public void tearDown() {   
        for (Task task : dao.getAll()) {
            dao.delete(task.getId());
        }      
    }

    @Test
    public void shouldDeleteById() {
        assertEquals(dao.getAll().size(), 1);
        
        for (Task task : dao.getAll()) {
            dao.delete(task.getId());
        }

        assertEquals(dao.getAll().size(), 0);
    }

    @Test
    public void shouldUpdateById() {
        assertEquals(dao.getAll().size(), 1);
        
        for (Task task : dao.getAll()) {
            task.setAppeal(true);
            dao.update(task.getId(), task);
        }

        for (Task task : dao.getAll()) {
            assertTrue(task.isAppeal());
        }
    }

    @Test
    public void shouldRetrieveById() {
       Iterator<Task> iterator = dao.getAll().iterator();
       
       Task task = iterator.next();
       
       assertEquals(task.getId(), dao.getById(task.getId()).getId());
    }
    
}
