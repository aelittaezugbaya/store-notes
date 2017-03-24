package com.storenotes.util;

import com.storenotes.domain.Employee;
import com.storenotes.domain.ExpiryDB;
import com.storenotes.domain.Rank;
import com.storenotes.domain.StoreSection;
import com.storenotes.domain.Task;
import javax.servlet.ServletContextEvent;
import javax.servlet.annotation.WebListener;
import org.hibernate.Session;

@WebListener
public class StartupListener implements javax.servlet.ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("StartupListener contextInitialized()");
        
        HibernateStuff.getInstance();
        populateDB();
        setupExpiryDB();
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("StartupListener contextDestroyed()");
    }
    
    private void populateDB() {
        Session session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();
        
        StoreSection section1 = new StoreSection("Vegetable section");
        StoreSection section2 = new StoreSection("Meat section");
        StoreSection section3 = new StoreSection("Bread section");
        StoreSection section4 = new StoreSection("Dairy section");
        StoreSection section5 = new StoreSection("Pastry section");
        StoreSection section6 = new StoreSection("Storage area");
        StoreSection section7 = new StoreSection("Cash counter area");
        StoreSection section8 = new StoreSection("Alcohol section");
        StoreSection section9 = new StoreSection("Soft drinks section");
        
        Employee employee1 = new Employee(
                "pekka",
                "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
                "terap98@icloud.com",
                "Pekka",
                Rank.WORKER
        );
        Employee employee2 = new Employee(
                "anna",
                "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
                "anna.marija@fakelidl.com",
                "Anna Maria",
                Rank.MANAGER
        );
        
        Employee employee3 = new Employee(
                "maija",
                "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
                "maija.kristi@fakelidl.com",
                "Maija Kristi",
                Rank.WORKER
        );
 
        Task task1 = new Task();
        task1.setName("Crean Refrigerator");
        task1.setDescription("Refrigerator in the specified section should be cleaned");
        task1.setTemplate(true);
        
        Task task2 = new Task();
        task2.setName("Remove empty boxes");
        task2.setDescription("Empty boxes in the specified section should be removed" + 
                " not to create obstacles to customers");
        task2.setTemplate(true);
        
        Task task3 = new Task();
        task3.setName("Add more products");
        task3.setDescription("Seems like we ran out of products in the specified section" +
                ", please fill the shelves as soon as possible to make sure " + 
                "customers can get the products they need");
        task3.setTemplate(true);
        
        Task task4 = new Task();
        task4.setName("Cashier is needed");
        task4.setDescription("There is a Cashier needed, please take the position " + 
                "to avoid long queues.");
        task4.setTemplate(true);
        
        Task task5 = new Task();
        task5.setName("Crean floor");
        task5.setDescription("The floor in the specified section seems to be dirty. " + 
                "Cleaning is required");
        task5.setTemplate(true);
        
        Task task6 = new Task();
        task6.setName("Fix refrigerator");
        task6.setDescription("A refrigerator in the specified section is broken. " + 
                "Order the maintenance as soon as possible");
        task6.setTemplate(true);
        
        Task task7 = new Task();
        task7.setName("Receive delivery");
        task7.setDescription("There is a delivery waiting to be received.");
        task7.setTemplate(true);

        session.saveOrUpdate(employee1);
        session.saveOrUpdate(employee2);          
        session.saveOrUpdate(employee3);
        
        session.saveOrUpdate(section1);
        session.saveOrUpdate(section2);
        session.saveOrUpdate(section3);
        session.saveOrUpdate(section4);
        session.saveOrUpdate(section5);
        session.saveOrUpdate(section6);
        session.saveOrUpdate(section7);
        session.saveOrUpdate(section8);
        session.saveOrUpdate(section9);
 
        session.saveOrUpdate(task1);
        session.saveOrUpdate(task2);
        session.saveOrUpdate(task3);
        session.saveOrUpdate(task4);
        session.saveOrUpdate(task5);
        session.saveOrUpdate(task6);
        session.saveOrUpdate(task7);

        session.getTransaction().commit();
    }
    
    private void setupExpiryDB() {
        ExpiryDB expiryDB = ExpiryDB.getInstance();
        
        expiryDB.startMocking();
    }
    
}