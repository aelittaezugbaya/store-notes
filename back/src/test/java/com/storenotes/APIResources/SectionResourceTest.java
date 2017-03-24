/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.APIResources;

import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.StoreSection;
import com.storenotes.domain.Task;
import java.util.Collection;
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
public class SectionResourceTest {
    private SectionResource resource;
    
    public SectionResourceTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
        resource = new SectionResource();
        
        StoreSection section = new StoreSection();
        section.setName("main");
        
        resource.addSection(section);
    }
    
    @After
    public void tearDown() {
        for (StoreSection section : resource.getSections()) {
            resource.deleteSection(section.getId());
        }
    }

    /**
     * Test of getSections method, of class SectionResource.
     */
    @Test
    public void shouldGetAllSections() {
        assertEquals(resource.getSections().size(), 1);
    }

    /**
     * Test of addSection method, of class SectionResource.
     */
    @Test
    public void shouldAddNewSection() {
        StoreSection section = new StoreSection();
        section.setName("another");
        
        resource.addSection(section);
        
        assertEquals(resource.getSections().size(), 2);
    }

    /**
     * Test of getSectionById method, of class SectionResource.
     */
    @Test
    public void shouldGetSectionById() {
        Iterator<StoreSection> iterator = resource.getSections().iterator();
        
        StoreSection section = iterator.next();
        
        assertEquals(resource.getSectionById(section.getId()).getId(), section.getId());
    }

    /**
     * Test of updateSection method, of class SectionResource.
     */
    @Test
    public void shouldUpdateExistingSection() {
        Iterator<StoreSection> iterator = resource.getSections().iterator();
        
        StoreSection section = iterator.next();
        section.setName("updated name");
        
        resource.updateSection(section.getId(), section);
        
        assertEquals(
                resource.getSectionById(section.getId()).getName(),
                section.getName()
        );
    }

    /**
     * Test of deleteSection method, of class SectionResource.
     */
    @Test
    public void shouldDeleteExistingSection() {
        Iterator<StoreSection> iterator = resource.getSections().iterator();
        
        StoreSection section = iterator.next();
        
        resource.deleteSection(section.getId());
        
        assertEquals(resource.getSections().size(), 0);
    }    
}
