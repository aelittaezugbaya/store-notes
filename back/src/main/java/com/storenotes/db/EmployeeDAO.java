/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.domain.Employee;

/**
 *
 * @author aleksandr
 */
public class EmployeeDAO extends AbstractUserDAO<Employee> {

    public EmployeeDAO() {
        super(Employee.class);
    }

    @Override
    public Employee updateFields(
            Employee updatable,
            Employee newObject
    ) {
        // updatable.setEnabled(newObject.isEnabled());
        updatable.setName(newObject.getName());
        // updatable.setPassword(newObject.getPassword());
        updatable.setRank(newObject.getRank());
        updatable.setTasks(newObject.getTasks());
        updatable.setCreatedTasks(newObject.getCreatedTasks());
        System.out.println("updatable" + updatable.getTasks().size());
        return updatable;
    }

}
