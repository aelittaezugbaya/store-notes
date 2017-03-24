/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain;

import com.storenotes.util.HibernateStuff;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Session;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author blaze
 */
public class TaskTest {

    private static Session session = null;

    public TaskTest() {
    }

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
     /*   session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();  */
    }

    @After
    public void tearDown() {
    }

    @Test
    public void defaultTaskDescriptionShouldBeCorrect() {
        System.out.println("Test for empty constructor");
        Task instance = new Task("a new task");
        String desc = "task description";
        assertEquals("test to check description of empty constructor", instance.getDescription(), desc);
    }

    /**
     * Test of getId method, of class Task.
     */
    @Test
    public void idSetterShouldWork() {
        System.out.println("Test for getId()");
        Task instance = new Task();
        instance.setId(9L);

        long result = instance.getId();
        assertEquals(result, 9L);
    }

    @Test
    public void idShouldNotBeSetByDefault() {
        System.out.println("Test for getId()");
        Task instance = new Task("clean floor");

        Long expResult = null;
        Long result = instance.getId();
        assertEquals("id should be null by default", expResult, result);

    }

    /**
     * Test of getName method, of class Task.
     */
    @Test
    public void nameSetterShouldWork() {
        System.out.println("getName");
        Task instance = new Task();
        instance.setName("simple task");
        String result = instance.getName();
        assertEquals("simple task", result);
    }

    @org.junit.Test
    public void descriptionSetterShouldWork() {
        System.out.println("setDescription");
        String description = "";
        Task instance = new Task();
        instance.setDescription(description);
        
        assertEquals(instance.getDescription(), description);
    }

    /**
     * Test of getSection method, of class Task.
     */
    @org.junit.Test
    public void sectionShouldNotBeSetByDefaut() {
        System.out.println("getSection");
        Task instance = new Task();

        StoreSection result = instance.getSection();
        //assertEquals(expResult, result);
        assertNull(result);
    }

    /**
     * Test of getStatus method, of class Task.
     */
    @Test
    public void statusShouldBeSetToNewByDefault() {
        System.out.println("getStatus");
        Task instance = new Task();
        Status result = instance.getStatus();
        Status expResult = Status.NEW;
        
        assertEquals(expResult, result);
    }

    /**
     * Test of setStatus method, of class Task.
     */
    @Test
    public void statusSetterShouldWork() {
        System.out.println("setStatus");
        Status status = Status.DOING;
        Task instance = new Task();
        instance.setStatus(status);
        
        assertEquals(instance.getStatus(), status);
    }

    /**
     * Test of getCreationTime method, of class Task.
     */
    @Test
    public void defaultCreationTimeShouldBeTheMomentOfTaskCreation() {
        System.out.println("getCreationTime");
        Task instance = new Task();
        long expResult = new Date().getTime();
        long result = instance.getCreationTime();
        assertTrue(Math.abs(expResult - result) < 30);
    }

    /**
     * Test of setCreationTime method, of class Task.
     */
    @Test
    public void creationTimeSetterShouldWorkCorrectly() {
        System.out.println("setCreationTime");
        long creationTime = 12345L;
        Task instance = new Task();
        instance.setCreationTime(creationTime);
        
        assertEquals(instance.getCreationTime(), creationTime);
    }

    /**
     * Test of getDueTime method, of class Task.
     */
    @Test
    public void dueDateShouldAlwaysBeTheSameOrLaterThanCreationDate() {
        System.out.println("getDueTime");
        Task instance = new Task();
        Long createDate = instance.getCreationTime();
        Long addedDate = (354600L);
        long dueDate = createDate - addedDate;
        instance.setDueTime(dueDate);

        boolean dueDateMoreThanCreateDate = false;
        if (createDate <= instance.getDueTime()) {
            dueDateMoreThanCreateDate = true;
        }
        
        assertTrue(dueDateMoreThanCreateDate);
    }

    /**
     * Test of isUrgent method, of class Task.
     */
    @Test
    public void urgentShouldBeFalseByDEfault() {
        System.out.println("isUrgent");
        Task instance = new Task();
        boolean expResult = false;
        boolean result = instance.isUrgent();
        assertEquals(expResult, result);

    }

    /**
     * Test of setUrgent method, of class Task.
     */
    @Test
    public void urgentSetterShouldWorkIfTruePassed() {
        System.out.println("setUrgent True");
        boolean urgent = true;
        Task instance = new Task();
        instance.setUrgent(urgent);
        assertTrue(instance.isUrgent());
    }

    @Test
    public void urgentSetterShouldWorkIfFalsePassed() {
        System.out.println("setUrgent False");
        boolean urgent = false;
        Task instance = new Task();
        instance.setUrgent(urgent);
        assertFalse(instance.isUrgent());
    }

    /**
     * Test of isAppeal method, of class Task.
     */
    @Test
    public void appealShouldBeFalseByDefault() {
        System.out.println("isAppeal");
        Task instance = new Task();
        boolean expResult = false;
        boolean result = instance.isAppeal();
        assertEquals(expResult, result);

    }

    /**
     * Test of setAppeal method, of class Task.
     */
    @Test
    public void appealSetterShouldWorkIfTruePassed() {
        System.out.println("setAppeal True");
        boolean appeal = true;
        Task instance = new Task();
        instance.setAppeal(appeal);
        assertTrue(instance.isAppeal());
    }

    @Test
    public void appealSetterShouldWorkIfFalsePassed() {
        System.out.println("setAppeal False");
        boolean appeal = false;
        Task instance = new Task();
        instance.setAppeal(appeal);
        assertFalse(instance.isAppeal());
    }

    /**
     * Test of hashCode method, of class Task.
     */
    @Test
    public void hashCodeShouldBeIdBasedOnly() {
        System.out.println("hashCode");
        
        Task instance1 = new Task();
        instance1.setId(5L);
        
        Task instance2 = new Task();
        instance2.setId(5L);
        
        assertEquals(instance1.hashCode(), instance2.hashCode());
    }

    /**
     * Test of equals method, of class Task.
     */
    @Test
    public void differentTasksWithTheSameIdShouldEqual() {
        System.out.println("hashCode");
        
        Task instance1 = new Task();
        instance1.setId(5L);
        instance1.setName("first name");
        
        Task instance2 = new Task();
        instance2.setId(5L);
        instance2.setName("second name");
        
        assertEquals(instance1, instance2);
    }

    @Test
    public void theSameTasksWithDifferentIdsShouldNotEqual() {
        System.out.println("hashCode");
        
        Task instance1 = new Task();
        instance1.setId(5L);
        instance1.setName("name");
        
        Task instance2 = new Task();
        instance2.setId(6L);
        instance2.setName("name");
        
        assertNotEquals(instance1, instance2);
    }

    /**
     * Test of getAssignees method, of class Task.
     */
    @Test
    public void assigneeGetterShouldWorkCorrectly() {
        System.out.println("getAssignees");
        Task instance = new Task("task 1");

        Employee em = new Employee();
        em.setName("ram");
        //em.setTasks(tasks);

        Set<Employee> expResult = new HashSet<>();
        expResult.add(em);
        instance.setAssignees(expResult);
        List<Task> tasks = new ArrayList<>();
        tasks.add(instance);
        Set<Employee> result = instance.getAssignees();
        
        ArrayList<Employee> emp = new ArrayList<Employee>();
        for(Employee e: result){
            emp.add(e);
        }
        assertEquals(em.getName(), emp.get(0).getName());
    }
}
