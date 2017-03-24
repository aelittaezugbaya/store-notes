/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
import com.storenotes.util.HibernateStuff;
import java.util.Collection;
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
public class AbstractDAOTest {
    // the two daos are the implementations of the tested abstract class
    private TaskDAO dao = new TaskDAO();
    private EmployeeDAO dao1 = new EmployeeDAO();

    public AbstractDAOTest() {
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
        for (Task task : dao.getAll()) {
            dao.delete(task.getId());
        }
        for (Employee employee : dao1.getAll()) {
            dao1.delete(employee.getUsername());
        }
    }
    /**
     * Test of add method, of class AbstractDAO.
     */
    @Test
    public void addShouldAddNewInstance() {
        System.out.println("Add task");
        Task task = new Task("clean fridge");
        task.setDescription("cool task");
        dao.add(task);

        Collection<Task> tasks = dao.getAll();
        
        assertEquals(1, tasks.size());
        
        for (Task dbTask : tasks) {
            assertEquals(task.getDescription(), dbTask.getDescription());
        }
    }

    /**
     * Test of getAll method, of class AbstractDAO.
     */
    @Test
    public void getAllShouldReturnAllValues() {
        System.out.println("getAll employees");
        Employee emd1 = new Employee();
        emd1.setUsername("usr1");
        emd1.setName("ram1");
        emd1.setRank(Rank.WORKER);
        
        Employee emd2 = new Employee();
        emd2.setUsername("usr2");
        emd2.setName("ram2");
        emd2.setRank(Rank.WORKER);
        
        Employee emd3 = new Employee();
        emd3.setUsername("usr3");
        emd3.setName("ram3");
        emd3.setRank(Rank.WORKER);

        dao1.add(emd1);
        dao1.add(emd2);
        dao1.add(emd3);

        Collection<Employee> employees = dao1.getAll();
        
        assertEquals(3, employees.size());
    }
}
