/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain;

import com.storenotes.APIResources.TaskResource;
import com.storenotes.db.StoreSectionDAO;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

/**
 *
 * @author aleksandr
 */
public class ExpiryDB {
    private Timer timer;
    private final TaskResource taskResource;
    private StoreSectionDAO sectionDAO;

    private ExpiryDB() {
        this.taskResource = new TaskResource();
        this.timer = new Timer();
        this.sectionDAO = new StoreSectionDAO();
    }

    public static ExpiryDB getInstance() {
        return ExpiryDBHolder.INSTANCE;
    }

    private static class ExpiryDBHolder {
        private static final ExpiryDB INSTANCE = new ExpiryDB();
    }
    
    public void startMocking() {
        this.timer.scheduleAtFixedRate(
                new expiryTimerTask(sectionDAO.getAll()),
                300000,
                300000
        );
    }

    public void stopMocking() {
        this.timer.cancel();
    }
    // the class is created for mocking reasons only and should not be looked at
    // as a normal Java class,most of the good practices are ruined here
    // and the members of the team are aware of it
    private class expiryTimerTask extends TimerTask {
        public List<Task> mockTasks;
        
        public expiryTimerTask(Collection<StoreSection> availableSections) {
            this.mockTasks = new ArrayList<>();
            Collection<String> sectionNames = new ArrayList<>();
            
            Map<String, StoreSection> sectionMap = new HashMap<>();
            
            for (StoreSection section : availableSections) {
                sectionMap.put(section.getName(), section);
            }
            
            
            Task task = new Task();
            task.setName("Juustoportti Milk has expired");
            task.setSection(sectionMap.get("Dairy section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Juustoportti Butter has expired");
            task.setSection(sectionMap.get("Dairy section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Minced Meat has expired");
            task.setSection(sectionMap.get("Meat section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Beer has expired");
            task.setSection(sectionMap.get("Alcohol section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Vaasan Ruispalat has expired");
            task.setSection(sectionMap.get("Bread section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Oltermani Cheese has expired");
            task.setSection(sectionMap.get("Dairy section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Cold cuts have expired");
            task.setSection(sectionMap.get("Meat section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Juice has expired");
            task.setSection(sectionMap.get("Soft drinks section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Apples, Italy. has expired");
            task.setSection(sectionMap.get("Vegetable section"));
            this.mockTasks.add(task);
            
            task = new Task();
            task.setName("Pastry has expired");
            task.setSection(sectionMap.get("Dairy section"));
            this.mockTasks.add(task);
        }
        

        @Override
        public void run() {
            Random random = new Random();
            
            Task mockedTask = this.mockTasks
                    .get(random.nextInt(this.mockTasks.size()));
            
            Task generatedTask = new Task();
            generatedTask.setName(mockedTask.getName());
            generatedTask.setSection(mockedTask.getSection());        
            generatedTask.setDescription("Please remove the item");
            generatedTask.setDueTime(generatedTask.getCreationTime() + 3600000);
            
            taskResource.addTask(generatedTask);
        }
    }
}
