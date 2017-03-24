/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
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
public class EmployeeDAOTest {
    EmployeeDAO dao;
    TaskDAO taskDAO;
    Employee sample;
    
    public EmployeeDAOTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        dao = new EmployeeDAO();
        taskDAO = new TaskDAO();
        
        for (Task task : taskDAO.getAll()) {
            taskDAO.delete(task.getId());
        }
        for (Employee employee : dao.getAll()) {
            dao.delete(employee.getUsername());
        }
        
        this.sample = new Employee();
        sample.setUsername("pekka");
        sample.setPassword("123456");
        sample.setName("pekka");
        sample.setRank(Rank.MANAGER);
        
        dao.add(sample);
    }
    
    @After
    public void tearDown() {
        dao.delete("pekka");
    }

    /**
     * Test of updateFields method, of class EmployeeDAO.
     */
    @Test
    public void shouldNotUpdateUsername() {
        sample.setUsername("anotherName");
        
        dao.update("pekka", sample);
        
        assertNull(dao.getByUsername("anotherName"));
    }
    
    @Test
    public void shouldNotUpdatePassword() {
        sample.setPassword("654321");
        
        dao.update("pekka", sample);
        
        assertEquals(dao.getByUsername("pekka").getPassword(), "123456");
    }
    
    @Test
    public void shouldUpdateCreatedTasks() {
        Task task = new Task();
        task.setName("task");
        task.setDescription("description");
        
        sample.addCreatedTask(task);
        
        taskDAO.add(task);
        dao.update("pekka", sample);
        
        assertEquals(dao.getByUsername("pekka").getCreatedTasks().size(), 1);
    }
    
    @Test
    public void shouldUpdateAssignedTasks() {
        Task task = new Task();
        task.setName("task");
        task.setDescription("description");
        
        sample.addTask(task);
        
        taskDAO.add(task);
        dao.update("pekka", sample);
        
        assertEquals(dao.getByUsername("pekka").getTasks().size(), 1);
    }
}
