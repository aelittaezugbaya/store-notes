/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.APIResources;

import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.WebSockets.PushType;
import com.storenotes.WebSockets.SocketMessageSender;
import com.storenotes.auth.EmailValidator;
import com.storenotes.auth.PasswordHasher;
import com.storenotes.db.EmployeeDAO;
import com.storenotes.domain.Employee;
import com.storenotes.domain.email.SendMail;
import com.storenotes.domain.Task;
import com.storenotes.domain.email.EmployeeEmailProcessor;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author aleksandr
 */
@Path("/employees")
public class EmployeeResource extends SocketMessageSender {
    private final EmployeeDAO employeeDAO;
    private final EmployeeEmailProcessor emailProcessor;
    
    public EmployeeResource() {
        super("ws://localhost:8080/back/employeesSocket");
        
        this.employeeDAO = new EmployeeDAO();
        this.emailProcessor = new EmployeeEmailProcessor(this.employeeDAO);
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Employee> getEmployees() {
        Collection<Employee> employees = this.employeeDAO.getAll();
        
        for (Employee employee : employees) {
            employee.setPassword("");
        }
        
        return employees;
    }
    
    public Collection<Employee> addEmployee(
        Employee employee,
        ActionInitiator initiator
    ) {
        return addEmployee(employee, initiator, true);
    }
    
    public Collection<Employee> addEmployee(
        Employee employee,
        ActionInitiator initiator,
        boolean useWebsocket
    ) {
        // hash password
        try {
            String password = PasswordHasher.hashPassword(employee.getPassword());
            
            employee.setPassword(password);
        } catch(Exception e) {
            
        }
        // validate email
        if (!EmailValidator.validate(employee.getEmail())) {
            return this.getEmployees();
        }
        
        Employee processed = this.employeeDAO.add(employee);
        
        // web socket used for push notifications
        if (useWebsocket) {
            super.sendMessageOverSocket(
                processed,
                PushType.CREATE,
                new ActionInitiator(initiator.getUsername())
            );
        }
        
        return this.getEmployees();
    }
    
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Collection<Employee> addEmployee(
            Employee employee,
            @Context HttpServletRequest request
    ) {
        String initiatorUsername = request.getHeader("PrettyGood-User");
        
        return addEmployee(employee, new ActionInitiator("initiatorUsername"));
    }
    
    @Path("/{username}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Employee getEmployeeByUsername(
            @PathParam("username") String username
    ) {
        Employee theEmployee = this.employeeDAO.getByUsername(username);
        
        theEmployee.setPassword("");
        return theEmployee;
    }
    
    public Collection<Employee> updateEmployee(
            @PathParam("username") String username,
            Employee employee,
            ActionInitiator initiator
    ) {
        return updateEmployee(username, employee, initiator, true);
    }
    
    public Collection<Employee> updateEmployee(
            @PathParam("username") String username,
            Employee employee,
            ActionInitiator initiator,
            boolean useWebSockets
    ) {
        this.emailProcessor.handleEmployeeUpdate(employee, initiator.getUsername());
        
        Employee processed = this.employeeDAO.update(username, employee);
        
        // web socket used for push notifications
        if (useWebSockets) {
            super.sendMessageOverSocket(
                processed,
                PushType.UPDATE,
                new ActionInitiator(initiator.getUsername())
            );
        }
        
        return this.getEmployees();
    }
    
    @Path("/{username}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Collection<Employee> updateEmployee(
            @PathParam("username") String username,
            Employee employee,
            @Context HttpServletRequest request
    ) {
        String initiatorUsername = request.getHeader("PrettyGood-User");
          
        return updateEmployee(
                username,
                employee,
                new ActionInitiator(initiatorUsername)
        );
    }
  
    @Path("/{username}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Employee deleteEmployee(
            @PathParam("username") String username
    )  {     
        Employee deleted = this.employeeDAO.delete(username);
        deleted.setPassword("");
        
        return deleted;
    }
 
    @Path("/{username}/tasks")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Task> getTasksByEmployee(
            @PathParam("username") String username
    ) {
        return this.employeeDAO.getByUsername(username)
                .getTasks();
    }
}
