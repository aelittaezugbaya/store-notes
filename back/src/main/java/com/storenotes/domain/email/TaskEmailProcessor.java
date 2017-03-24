/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain.email;

import com.storenotes.WebSockets.ActionInitiator;
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
public class TaskEmailProcessor {
    private final TaskDAO taskDAO;
    private final EmployeeDAO employeeDAO;
    
    public TaskEmailProcessor(TaskDAO taskDAO, EmployeeDAO employeeDAO) {
        this.taskDAO = taskDAO;
        this.employeeDAO = employeeDAO;
    }
    
    public boolean handleTaskCreate(
            Task task,
            ActionInitiator initiator
    ) {
         // if the task is urgent
        if (task.isUrgent()) {
            EmployeeDAO dao = new EmployeeDAO();
            
            final Task sentTask = task;
            
            Collection<Employee> employees = new HashSet<>();
            // filter out the initiator of the task
            for (Employee employee : dao.getAll()) {
                if (!employee.getUsername().equals(initiator.getUsername())) {
                    employees.add(employee);
                }
            }
            final Collection<Employee> recievers = employees;

            // send email in a separate thread
            new Thread(new Runnable() {
                @Override
                public void run() {
                    SendMail sender = new SendMail();
                    sender.mailForward(recievers, sentTask);
                }
            }).start();

            System.out.println("Urgent task email");
            return recievers.size() > 0;
        }
        
        return false;
    }
    
    public boolean handleTaskUpdate(Long id, final Task task) {
        int emailCounter = 0;
        
        task.setId(id);
        // if it is acceptance of an appeal send email to the appeal creator
        Task initTask = this.taskDAO.getById(id);
        System.out.println(initTask.isAppeal() + " " + task.isAppeal());
        if (initTask.isAppeal() && !task.isAppeal()) {
            Collection<Employee> employees = this.employeeDAO.getAll();
            for (final Employee employee : employees) {
                if (employee.getCreatedTasks().contains(task)) {
                    // send email in a separate thread
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            SendMail sender = new SendMail();
                            sender.mailForward(employee, task, true);
                        }
                    }).start();
                    
                    emailCounter++;
                }
            }
        }
        
        return emailCounter > 0;
    }
    
    public boolean handleTaskDelete(Long id, String initiatorUsername) {
        int emailCounter = 0;
        
        final Task task = this.taskDAO.getById(id);
        
        Collection<Employee> employees = this.employeeDAO.getAll();
        for (Employee employee : employees) {
            if (employee.getTasks().contains(task)) {
                employee.removeTask(id);
                Employee processedEmployee = this.employeeDAO
                        .update(employee.getUsername(), employee);
            }
            
            if (employee.getCreatedTasks().contains(task)) {
                employee.removeCreatedTask(id);
                final Employee processedEmployee = this.employeeDAO
                        .update(employee.getUsername(), employee);
                
                // send email if the task was an appeal
                // no email to an initiator however
                if (task.isAppeal() && !employee.getUsername().equals(initiatorUsername)) {
                    // send email in a separate thread
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            SendMail sender = new SendMail();
                            sender.mailForward(processedEmployee, task, true);
                        }
                    }).start();
                    emailCounter++;
                }
            }
        }
        
        return emailCounter > 0;
    }
}
