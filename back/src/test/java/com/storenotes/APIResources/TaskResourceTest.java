/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.APIResources;

import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.domain.Status;
import com.storenotes.domain.Task;
import java.util.Collection;
import java.util.Iterator;
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
public class TaskResourceTest {
    private TaskResource resource;
    private Long id = 0L;
    private Task task;
    
    public TaskResourceTest() {
        
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        resource = new TaskResource();
        
        Task task = new Task();
        // task.setId(id);
        task.setName("my task");
        task.setDescription("my description");
        task.setAppeal(false);
        
        this.task = task;
        
        resource.addTask(task, false);
    }
    
    @After
    public void tearDown() {
        for (Task tasks : resource.getTasks(true, false)) {
            resource.deleteTask(tasks.getId(), new ActionInitiator(), false);
        }
    }

    /**
     * Test of getTasks method, of class TaskResource.
     */
    @Test
    public void shouldGetTasks() {
        assertEquals(resource.getTasks(true, false).size(), 1);
    }

    /**
     * Test of addTask method, of class TaskResource.
     */
    @Test
    public void shouldAddTask() {
        Task task = new Task();
        task.setName("my task");
        task.setDescription("my description");
        
        resource.addTask(task, false);
        
        assertEquals(resource.getTasks(true, false).size(), 2);
    }

    @Test
    public void shouldGetTaskById() {
        Iterator<Task> tasks = resource.getTasks(true, false).iterator();
        
        Task theTask = tasks.next();
        
        assertEquals(resource.getTaskById(theTask.getId()).getId(), theTask.getId());
    }

    @Test
    public void shouldUpdateTask() {
        Task updatedTask = new Task();
        updatedTask.setName("updated name");
        updatedTask.setDescription("updated description");
        updatedTask.setStatus(Status.DONE);
        updatedTask.setAppeal(false);
        updatedTask.setUrgent(false);
        
        Iterator<Task> tasks = resource.getTasks(true, false).iterator();
        
        Task theTask = tasks.next();
        
        resource.updateTask(theTask.getId(), updatedTask, false);
        
        Task resultTask = resource.getTaskById(theTask.getId());
        
        assertEquals(resultTask.getName(), "updated name");
        assertEquals(resultTask.getDescription(), "updated description");
        assertEquals(resultTask.getStatus(), Status.DONE);
    }


    @Test
    public void shouldDeleteTask() {
        Iterator<Task> tasks = resource.getTasks(true, false).iterator();
        
        Task theTask = tasks.next();
        
        resource.deleteTask(theTask.getId(), new ActionInitiator(), false);
        
        assertEquals(resource.getTasks(true, false).size(), 0);
    }
}
