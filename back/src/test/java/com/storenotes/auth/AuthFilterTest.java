/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.auth;

import com.storenotes.APIResources.EmployeeResource;
import com.storenotes.APIResources.TaskResource;
import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
import org.apache.catalina.core.ApplicationFilterConfig;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
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
public class AuthFilterTest {
    AuthFilter filter;
    Method authenticate;
    Method authorize;
    Method initDAOs;
    EmployeeResource resource;
    TaskResource taskResource;
    
    
    public AuthFilterTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        try {
            authenticate = AuthFilter.class
                .getDeclaredMethod(
                        "isAuthenticated",
                        String.class,
                        String.class
                );
            authenticate.setAccessible(true);
            
            authorize = AuthFilter.class
                .getDeclaredMethod(
                        "isAuthorized",
                        String.class,
                        String.class,
                        String.class
                );
            authorize.setAccessible(true);
            
            initDAOs = AuthFilter.class
                .getDeclaredMethod(
                       "initDAOs"
                );
            initDAOs.setAccessible(true);
            
        } catch(Exception e) {
            fail();
        }
       
        filter = new AuthFilter();
        try {
            this.initDAOs.invoke(filter);            
        } catch (IllegalAccessException ex) {
            Logger.getLogger(AuthFilterTest.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IllegalArgumentException ex) {
            Logger.getLogger(AuthFilterTest.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InvocationTargetException ex) {
            Logger.getLogger(AuthFilterTest.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        resource = new EmployeeResource();
        taskResource = new TaskResource();
        
        Employee employee = new Employee();
        employee.setName("pekka");
        employee.setUsername("pekka");
        employee.setPassword("123456");
        employee.setEmail("pekka@example.com");
        employee.setRank(Rank.WORKER);
        
        Employee manager = new Employee();
        manager.setName("anna");
        manager.setUsername("anna");
        manager.setPassword("123456");
        manager.setEmail("anna@example.com");
        manager.setRank(Rank.MANAGER);
            
        resource.addEmployee(employee, new ActionInitiator(), false);
        resource.addEmployee(manager, new ActionInitiator(), false);
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

    @Test
    public void shouldAuthenticateWhenCredentialsAreCorrect() {
        try {
            String hashedPass = PasswordHasher.hashPassword("123456");
            
            assertTrue((boolean) this.authenticate.invoke(filter, "pekka", hashedPass));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldNotAuthenticateWhenCredentialsAreNotCorrect() {
        try {
            String hashedPass = PasswordHasher.hashPassword("123455");
            
            assertFalse((boolean) this.authenticate.invoke(filter, "pekka", hashedPass));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldNotAllowWorkerToCreateUsers() {
        try {            
            assertFalse((boolean) this.authorize
                    .invoke(
                            filter,
                            "pekka",
                            "/back/webresources/employees",
                            "POST"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldAllowManagerToCreateUsers() {
        try {            
            assertTrue((boolean) this.authorize
                    .invoke(
                            filter,
                            "anna",
                            "/back/webresources/employees",
                            "POST"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldNotAllowWorkerToDeleteUsers() {
        try {
            assertFalse((boolean) this.authorize
                    .invoke(
                            filter,
                            "pekka",
                            "/back/webresources/employees/deletable",
                            "DELETE"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldAllowManagerToDeleteUsers() {
        try { 
            assertTrue((boolean) this.authorize
                    .invoke(
                            filter,
                            "anna",
                            "/back/webresources/employees/deletable",
                            "POST"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldNotAllowWorkerToDeleteSections() {
        try {       
            assertFalse((boolean) this.authorize
                    .invoke(
                            filter,
                            "pekka",
                            "/back/webresources/sections/5",
                            "DELETE"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldAllowManagerToDeleteSections() {
        try {            
            assertTrue((boolean) this.authorize
                    .invoke(
                            filter,
                            "anna",
                            "/back/webresources/sections/5",
                            "DELETE"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldNotAllowWorkerToDeleteOthersTasks() {
        Task task = new Task();
        // task.setAppeal(false);
        taskResource.addTask(task, false);
        
        Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
        Task processedTask = iterator.next();
        
        try {            
            assertFalse((boolean) this.authorize
                    .invoke(
                            filter,
                            "pekka",
                            "/back/webresources/tasks/" + processedTask.getId(),
                            "DELETE"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldAllowManagerToDeleteOthersTasks() {
        try {        
            assertTrue((boolean) this.authorize
                    .invoke(
                            filter,
                            "anna",
                            "/back/webresources/tasks/9",
                            "DELETE"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldAllowWorkerToRejectAppeal() {
        Task appeal = new Task();
        appeal.setAppeal(true);
        taskResource.addTask(appeal, false);
        
        Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
        Task processedAppeal = iterator.next();
        
        Employee pekka = resource.getEmployeeByUsername("pekka");
        pekka.addTask(processedAppeal);
        resource.updateEmployee("pekka", pekka, new ActionInitiator(), false);
        
        try {
            String hashedPass = PasswordHasher.hashPassword("123455");
            
            assertTrue((boolean) this.authorize
                    .invoke(
                            filter,
                            "pekka",
                            "/back/webresources/tasks/" + processedAppeal.getId(),
                            "PUT"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
    @Test
    public void shouldAllowWorkerToAcceptAppeal() {
        Task appeal = new Task();
        appeal.setAppeal(true);
        taskResource.addTask(appeal, false);
        
        Iterator<Task> iterator = taskResource.getTasks(true, false).iterator();
        Task processedAppeal = iterator.next();
        
        Employee pekka = resource.getEmployeeByUsername("pekka");
        pekka.addTask(processedAppeal);
        resource.updateEmployee("pekka", pekka, new ActionInitiator(), false);
        
        try {
            String hashedPass = PasswordHasher.hashPassword("123455");
            
            assertTrue((boolean) this.authorize
                    .invoke(
                            filter,
                            "pekka",
                            "/back/webresources/tasks/" + processedAppeal.getId(),
                            "DELETE"
                    ));
        } catch (Exception ex) {
            fail("Sometihng went wrong with internals");
        }
    }
    
}
