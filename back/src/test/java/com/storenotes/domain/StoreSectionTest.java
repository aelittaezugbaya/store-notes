/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain;

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
public class StoreSectionTest {

    private Session session;

    public StoreSectionTest() {
    }

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
    /*    session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();  */
    }

    @After
    public void tearDown() {
    }

    @Test
    public void namePassedToConstructorShouldBeSet() {
        System.out.println("named constructor");
        StoreSection instance = new StoreSection("fish section");
        String name = instance.getName();
        assertEquals(name, "fish section");
    }

    /**
     * Test of getId method, of class StoreSection.
     */
    @Test
    public void shouldNotSetIdInConstructor() {
        System.out.println("getId");
        StoreSection instance = new StoreSection();
        assertNull(instance.getId());
    }

    /**
     * Test of setId method, of class StoreSection.
     */
    @Test
    public void idSetterShouldWork() {
        System.out.println("setId");
        Long id = 9L;
        StoreSection instance = new StoreSection();
        instance.setId(id);
        
        assertEquals(instance.getId(), id);
    }
    /**
     * Test of getName method, of class StoreSection.
     */
    @Test
    public void nameSetterShouldWork() {
        System.out.println("getName");
        StoreSection instance = new StoreSection();
        String expResult = "hot product";
        instance.setName(expResult);
        assertEquals(instance.getName(), expResult);

    } 
}
