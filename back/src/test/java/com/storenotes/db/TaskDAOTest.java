/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.domain.Task;
import com.storenotes.util.HibernateStuff;
import java.util.Collection;
import java.util.Date;
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
public class TaskDAOTest {
    private TaskDAO taskdao = new TaskDAO();
    
    public TaskDAOTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        this.tearDown();
    }

    @After
    public void tearDown() {
        for (Task task : taskdao.getAll()) {
            taskdao.delete(task.getId());
        }
    }

    @Test
    public void shouldUpdateTaskName() {
        System.out.println("updateFields");
        String updatable = "old name";
        String newObject = "new name";

        Task instance = new Task();
        instance.setName(updatable);
        assertNull(instance.getId());
        taskdao.add(instance);
        assertNotNull(instance.getId());
        Long id = instance.getId();

        //read
        Task task2 = new Task();
        // setUp();
        task2 = taskdao.getById(id);
        assertEquals(task2.getName(), updatable);

        //update
        task2.setName(newObject);
        taskdao.update(task2.getId(), task2);
        
        //read again
        // setUp();
        Task task3 = taskdao.getById(id);
        assertEquals(task3.getName(), newObject);
    }
    
    @Test
    public void shouldUpdateTaskDescription() {
        System.out.println("updateFields");
        String updatable = "old description";
        String newObject = "new description";

        Task instance = new Task();
        instance.setDescription(updatable);
        assertNull(instance.getId());
        taskdao.add(instance);
        assertNotNull(instance.getId());
        Long id = instance.getId();

        //read
        Task task2 = new Task();
        // setUp();
        task2 = taskdao.getById(id);
        assertEquals(task2.getDescription(), updatable);

        //update
        task2.setDescription(newObject);
        taskdao.update(task2.getId(), task2);
        
        //read again
        // setUp();
        Task task3 = taskdao.getById(id);
        assertEquals(task3.getDescription(), newObject);
    }
    
    @Test
    public void shouldNotUpdateTaskCreationTime() {
        System.out.println("updateFields");
        long newTime = 999999999999L;
        
        long oldCreationTime = new Date().getTime();
        Task instance = new Task();
        assertNull(instance.getId());
        taskdao.add(instance);
        assertNotNull(instance.getId());
        Long id = instance.getId();

        //read
        Task task2 = new Task();
        // setUp();
        task2 = taskdao.getById(id);
        assertTrue(Math.abs(task2.getCreationTime() - oldCreationTime) < 30);

        //update
        task2.setCreationTime(newTime);
        assertEquals(task2.getCreationTime(), newTime);
        taskdao.update(task2.getId(), task2);
        
        //read again
        // setUp();
        Task task3 = taskdao.getById(id);
        assertNotEquals(task3.getDescription(), newTime);
    }
    
    @Test
    public void getAllShouldNotReturnTaskTemplates() {
        Task instance = new Task();
        taskdao.add(instance);
        
        Task template = new Task();
        template.setTemplate(true);
        taskdao.add(template);
        
        Collection<Task> tasks = taskdao.getAll();
        
        for (Task task : tasks) {
            assertFalse(task.isTemplate());
        }
    }
    
    @Test
    public void getTemplatesShouldReturnOnlyTaskTemplates() {
        Task instance = new Task();
        taskdao.add(instance);
        
        Task template = new Task();
        template.setTemplate(true);
        taskdao.add(template);
        
        Collection<Task> tasks = taskdao.getAllTemplates();
        
        for (Task task : tasks) {
            assertTrue(task.isTemplate());
        }
    }
}
