/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.domain.Task;
import java.util.Collection;
import java.util.HashSet;

/**
 *
 * @author aleksandr
 */
public class TaskDAO extends AbstractIdentifiableDAO<Task> {
    
    public TaskDAO() {
        super(Task.class);
    }
    
    @Override
    public Task updateFields (Task updatable, Task newObject) {
        updatable.setAppeal(newObject.isAppeal());
        updatable.setDescription(newObject.getDescription());
        updatable.setDueTime(newObject.getDueTime());
        updatable.setName(newObject.getName());
        updatable.setStatus(newObject.getStatus());
        updatable.setUrgent(newObject.isUrgent());
        
        return updatable;
    }
    
    @Override
    public Collection<Task> getAll() {
        Collection<Task> tasks = new HashSet<>();
        
        for (Task task : super.getAll()) {
            if (!task.isTemplate()) {
                tasks.add(task);
            }
        }
        
        return tasks;
    }
    
    public Collection<Task> getAllTemplates() {
        Collection<Task> tasks = new HashSet<>();
        
        for (Task task : super.getAll()) {
            if (task.isTemplate()) {
                tasks.add(task);
            }
        }
        
        return tasks;
    }
}
