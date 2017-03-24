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
import com.storenotes.db.TaskDAO;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
import java.util.Iterator;
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
public class TaskEmailProcessorTest {
    private EmployeeResource resource;
    private TaskResource taskResource;
    private TaskEmailProcessor processor ;
    
    public TaskEmailProcessorTest() {
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
        
        Task task = new Task();
        task.setName("my task");
        task.setDescription("description");
        task.setAppeal(true);
        task.setUrgent(false);
        
        taskResource.addTask(task, false);
        
        Employee employee = new Employee();
        employee.setUsername("pekka");
        employee.setEmail("pekka@lidl.fi");
        employee.setName("pekka");
        employee.setRank(Rank.MANAGER);
        employee.addCreatedTask(task);
        
        resource.addEmployee(employee, new ActionInitiator(), false);
        
        this.processor = new TaskEmailProcessor(
               new TaskDAO(),
                new EmployeeDAO()
        );
    }
    
    @After
    public void tearDown() {
        for (Employee employee : resource.getEmployees()) {
            resource.deleteEmployee(employee.getUsername());
        }
        
        for (Task task : taskResource.getTasks(true, false)) {
            taskResource.deleteTask(task.getId(), new ActionInitiator(), false);
        }
    }

    /**
     * Test of handleTaskCreate method, of class TaskEmailProcessor.
     */
    @Test
    public void shouldSendEmailIfTaskIsUrgent() {
        Task task = new Task();
        task.setName("my task");
        task.setDescription("description");
        task.setAppeal(false);
        task.setUrgent(true);
        
        
        
        assertTrue(processor.handleTaskCreate(task, new ActionInitiator("Somebody")));
    }
    
    @Test
    public void shouldNotSendEmailIfTaskIsNotUrgent() {
        Task task = new Task();
        task.setName("my task");
        task.setDescription("description");
        task.setAppeal(false);
        task.setUrgent(false);
        
        TaskEmailProcessor processor = new TaskEmailProcessor(
               new TaskDAO(),
                new EmployeeDAO()
        );
        
        assertFalse(processor.handleTaskCreate(task, new ActionInitiator("Somebody")));
    }
    
    @Test
    public void shouldNotSendEmailToCreatorEvenIfTaskIsUrgent() {
        Task task = new Task();
        task.setName("my task");
        task.setDescription("description");
        task.setAppeal(false);
        task.setUrgent(true);
        
        TaskEmailProcessor processor = new TaskEmailProcessor(
               new TaskDAO(),
                new EmployeeDAO()
        );
        
        assertFalse(processor.handleTaskCreate(task, new ActionInitiator("pekka")));
    }

    /**
     * Test of handleTaskUpdate method, of class TaskEmailProcessor.
     */
    @Test
    public void shouldSendEmailIfAppealIsAccepted() {
       Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
       Task oldTask = iterator.next();
       
       oldTask.setAppeal(false);
        
       assertTrue(processor.handleTaskUpdate(oldTask.getId(), oldTask));
    }
    
    @Test
    public void shouldNotSendEmailOnUsualTaskUpdate() {
       Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
       Task oldTask = iterator.next();
       
       oldTask.setDescription("updated description");
        
       assertFalse(processor.handleTaskUpdate(oldTask.getId(), oldTask));
    }

    /**
     * Test of handleTaskDelete method, of class TaskEmailProcessor.
     */
    @Test
    public void shouldSendEmailIfAppealIsRejected() {
       Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
       Task oldTask = iterator.next();
        
       assertTrue(processor.handleTaskDelete(oldTask.getId(), "whoever"));
    }
    
    @Test
    public void shouldNotSendEmailOnUsualTaskDeletion() {
       Task oridinaryTask = new Task();
       oridinaryTask.setAppeal(false);
       taskResource.addTask(oridinaryTask, false);
        
       Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
       Task oldTask = iterator.next();
       if(!oldTask.isAppeal()) {
           assertFalse(processor.handleTaskDelete(oldTask.getId(), "whoever"));
       } else {
           oldTask = iterator.next();
           assertFalse(processor.handleTaskDelete(oldTask.getId(), "whoever"));
       }
    }
}
