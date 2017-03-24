/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.APIResources;

import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
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
public class EmployeeResourceTest {
    private EmployeeResource resource;
    private TaskResource taskResource;
    
    public EmployeeResourceTest() {
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
     * Test of getEmployees method, of class EmployeeResource.
     */
    @Test
    public void shouldGetAllEmployees() {
        assertEquals(resource.getEmployees().size(), 1);
    }

    /**
     * Test of addEmployee method, of class EmployeeResource.
     */
    @Test
    public void shouldAddNewEmployee() {
        Employee newee = new Employee();
        newee.setUsername("newee");
        newee.setEmail("qqqqqqq@qqqqqqq.qqq");
        
        resource.addEmployee(newee, new ActionInitiator(), false);
        
        assertEquals(resource.getEmployees().size(), 2);
    }

    /**
     * Test of getEmployeeByUsername method, of class EmployeeResource.
     */
    @Test
    public void shouldGetEmployeeByUsername() {
        assertNotNull(resource.getEmployeeByUsername("pekka"));
        assertEquals(resource.getEmployeeByUsername("pekka").getUsername(), "pekka");
    }

    /**
     * Test of updateEmployee method, of class EmployeeResource.
     */
    @Test
    public void shouldUpdateExistingEmployee() {
        Employee newEmployee = new Employee();
        newEmployee.setUsername("pekka");
        newEmployee.setRank(Rank.WORKER);
        
        resource.updateEmployee("pekka", newEmployee, new ActionInitiator(), false);
        
        assertEquals(resource.getEmployeeByUsername("pekka").getRank(), Rank.WORKER);
    }

    /**
     * Test of deleteEmployee method, of class EmployeeResource.
     */
    @Test
    public void shouldDeleteEmployee() {
        resource.deleteEmployee("pekka");
        
        assertEquals(resource.getEmployees().size(), 0);
    }

    /**
     * Test of getTasksByEmployee method, of class EmployeeResource.
     */
    @Test
    public void shouldGetTasksAssignedToExistingEmployee() {
        Task task1 = new Task("task 1");
        Task task2 = new Task("task 2");
        
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);
        
        taskResource.addTask(task1, false);
        taskResource.addTask(task2, false);
        
        Employee anna = new Employee();
        anna.setUsername("anna");
        anna.setTasks(tasks);
        anna.setEmail("anna@lidl.fi");
        
        resource.addEmployee(anna, new ActionInitiator(), false);
        
        assertEquals(resource.getTasksByEmployee("anna").size(), 2);
    }
    
    @Test
    public void shouldNotCreateEmployeeWithInvalidEmail() {
        int init = resource.getEmployees().size();
        
        Employee subject = new Employee();
        subject.setUsername("subject");
        subject.setEmail("q@q.q");
        
        resource.addEmployee(subject, new ActionInitiator(), false);
        
        assertEquals(resource.getEmployees().size(), init);
    }
}
