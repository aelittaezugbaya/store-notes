/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain.email;

import com.storenotes.db.EmployeeDAO;
import com.storenotes.db.TaskDAO;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Task;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

/**
 *
 * @author aleksandr
 */
public class EmployeeEmailProcessor {
    private final EmployeeDAO employeeDAO;
    
    public EmployeeEmailProcessor(EmployeeDAO employeeDAO) {
        this.employeeDAO = employeeDAO;
    }
    
    public boolean handleEmployeeUpdate(
            Employee employee,
            String initiatorUsername
    ) {
        int emailCounter = 0;
        // email to assignees
        Employee oldEmployee = employeeDAO.getByUsername(employee.getUsername());
        
        final Employee reciever = employee;
        
        Collection<Task> newTasks = new HashSet<>();
        List<Task> oldTasks = oldEmployee.getTasks();
        List<Task> allTasks = employee.getTasks();
        for (Task task : allTasks) {
            if (oldTasks.indexOf(task) == -1 &&
                    !reciever.getUsername().equals(initiatorUsername)) {
                final Task sentTask = task;
                 // send email in a separate thread
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        SendMail sender = new SendMail();
                        sender.mailForward(reciever, sentTask);
                    }
                }).start();
                emailCounter++;
                System.out.println("Task appeal email");
            }
        }
        
        return emailCounter > 0;
    }
}
