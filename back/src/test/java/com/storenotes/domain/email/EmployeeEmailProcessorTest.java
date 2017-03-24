/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain.email;

import com.storenotes.APIResources.EmployeeResource;
import com.storenotes.APIResources.TaskResource;
import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.db.EmployeeDAO;
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
public class EmployeeEmailProcessorTest {
    private EmployeeResource resource;
    private TaskResource taskResource;
    
    public EmployeeEmailProcessorTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        resource = new EmployeeResource();
        taskResource = new TaskResource();
        
        Employee employee = new Employee();
        employee.setUsername("pekka");
        employee.setEmail("pekka@lidl.fi");
        employee.setName("pekka");
        employee.setRank(Rank.MANAGER);
        
        resource.addEmployee(employee, new ActionInitiator(), false);
    }
    
    @After
    public void tearDown() {
        for (Employee employee : resource.getEmployees()) {
            resource.deleteEmployee(employee.getUsername());
        }
    }

    /**
     * Test of handleEmployeeUpdate method, of class EmployeeEmailProcessor.
     */
    @Test
    public void sendsEmailToNewTaskAssignees() {
        Task task1 = new Task("my new task");
        
        taskResource.addTask(task1, false);
        
        Employee newEmployee = resource.getEmployeeByUsername("pekka");
        newEmployee.addTask(task1);
        
        EmployeeEmailProcessor processor =
                new EmployeeEmailProcessor(new EmployeeDAO());
        
        assertTrue(processor.handleEmployeeUpdate(newEmployee, "anna"));
    }
    
    @Test
    public void shouldNotSendEmailIfNoNewTasksAssigned() {        
        Employee newEmployee = resource.getEmployeeByUsername("pekka");
        newEmployee.setName("Pekka Vuorinen");
        
        EmployeeEmailProcessor processor =
                new EmployeeEmailProcessor(new EmployeeDAO());
        
        assertFalse(processor.handleEmployeeUpdate(newEmployee, "anna"));
    }
    
    @Test
    public void shouldNotSendEmailIfTaskWasAssignedByEmployeeToHimself() {        
        Task task1 = new Task("my new task");
        
        taskResource.addTask(task1, false);
        
        Employee newEmployee = resource.getEmployeeByUsername("pekka");
        newEmployee.addTask(task1);
        
        EmployeeEmailProcessor processor =
                new EmployeeEmailProcessor(new EmployeeDAO());
        
        assertFalse(processor.handleEmployeeUpdate(newEmployee, "pekka"));
    }
}
