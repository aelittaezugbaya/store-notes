/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain;

import com.storenotes.util.HibernateStuff;
import java.util.ArrayList;
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
public class EmployeeTest {

    private static Session session = null;

    public EmployeeTest() {
    }

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
//        session = HibernateStuff.getInstance()
//                .getSessionFactory()
//                .openSession();
//        session.beginTransaction();
    }

    @After
    public void tearDown() {
    }

    @Test
    public void filledConstructorShouldUseArgumentsCorrectly() {
        Employee instance = new Employee("user1", "blah", "something@sth.com",
                "user", Rank.WORKER);
        String result = instance.getEmail();
        assertEquals(instance.getEmail(), result);
    }

    /**
     * Test of getRank method, of class Employee.
     */
    @Test
    public void workerRankShouldBeDefault() {
        System.out.println("getRank");
        Employee instance = new Employee();
        Rank expResult = Rank.WORKER;
        Rank result = instance.getRank();
        assertEquals(expResult, result);
        
    }

    /**
     * Test of setRank method, of class Employee.
     */
    @Test
    public void setRankShouldWorkAccordingly() {
        System.out.println("setRank");
        Rank rank = Rank.MANAGER;
        Employee instance = new Employee();
        instance.setRank(rank);
        assertEquals(rank, instance.getRank());
        
    }

    /**
     * Test of getName method, of class Employee.
     */
    @Test
    public void defaultNameShouldBeEmptyString() {
        System.out.println("getName");
        Employee instance = new Employee();
        String expResult = "";
        String result = instance.getName();
        assertEquals(expResult, result);
        
    }

    /**
     * Test of setName method, of class Employee.
     */
    @Test
    public void nameSetterShouldWork() {
        System.out.println("setName");
        String name = "newName";
        Employee instance = new Employee();
        instance.setName(name);
        assertEquals(name, instance.getName());
    }

    /**
     * Test of getTasks method, of class Employee.
     */
    @Test
    public void addTaskWorksAccordingly() {
        System.out.println("getTasks");
        Employee instance = new Employee();
        Task task1 = new Task("check food");
        instance.addTask(task1);
        
        List<Task> result = instance.getTasks();
        assertEquals(1, result.size());
        assertEquals(result.get(0).getName(), "check food");
    }

    /**
     * Test of setTasks method, of class Employee.
     */
    @Test
    public void taskSetterWorksCorerectly() {
        System.out.println("setTasks");
        List<Task> tasks = new ArrayList<>();
        tasks.add(new Task("my task"));
        
        Employee instance = new Employee();
        instance.setTasks(tasks);
        
        assertEquals(instance.getTasks().size(), 1);
        assertEquals(instance.getTasks().get(0).getName(), "my task");        
    }

    /**
     * Test of getCreatedTasks method, of class Employee./     */
    @Test
    public void addCreatedTaskWorksCorrectly() {
        System.out.println("getCreatedTasks");
        Employee instance = new Employee();
        instance.addCreatedTask(new Task());

        List<Task> result = instance.getCreatedTasks();
        assertEquals(1, result.size());
    }

    /**
     * Test of setCreatedTasks method, of class Employee.
     */
    @Test
    public void createdTasksSetterWorksCorrectly() {
        System.out.println("setCreatedTasks");
        List<Task> createdTasks = new ArrayList<>();
        
        createdTasks.add(new Task());
        createdTasks.add(new Task());
        createdTasks.add(new Task());
        
        Employee instance = new Employee();
        instance.setCreatedTasks(createdTasks);
        assertEquals(instance.getCreatedTasks().size(), 3);
    }

    /**
     * Test of removeTask method, of class Employee.
     */
    @Test
    public void removeTaskShouldRemoveAssignedTask() {
        System.out.println("removeTask");
        Employee instance = new Employee();
        ArrayList<Task> tasks = new ArrayList<Task>();
        Task task1 = new Task("task 1");
        task1.setId(5L);
        Task task2 = new Task("task 2");
        task2.setId(6L);
        
        tasks.add(task1);
        tasks.add(task2);
        
        instance.setTasks(tasks);
        
        instance.removeTask(5L);
        assertEquals(instance.getTasks().size(), 1);
    }

}
