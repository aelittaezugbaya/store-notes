package com.storenotes.APIResources;

import com.storenotes.WebSockets.ActionInitiator;
import com.storenotes.WebSockets.SocketMessageSender;
import com.storenotes.WebSockets.PushType;
import com.storenotes.db.EmployeeDAO;
import com.storenotes.db.TaskDAO;
import com.storenotes.domain.email.SendMail;
import com.storenotes.domain.Task;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Status;
import com.storenotes.domain.email.TaskEmailProcessor;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.function.Predicate;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("/tasks")
public class TaskResource extends SocketMessageSender {

    private final TaskDAO taskDAO;
    private final EmployeeDAO employeeDAO;
    private final TaskEmailProcessor emailProcessor;

    public TaskResource() {
        super("ws://localhost:8080/back/tasksSocket");

        taskDAO = new TaskDAO();
        employeeDAO = new EmployeeDAO();
        this.emailProcessor = new TaskEmailProcessor(taskDAO, employeeDAO);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Task> getTasks(
            @QueryParam("includeCompleted")
            @DefaultValue("true") boolean includeCompleted,
            @QueryParam("templates")
            @DefaultValue("false") boolean templates
    ) {
        if (templates) {
            return this.taskDAO.getAllTemplates();
        } else {
            Collection<Task> allTasks = this.taskDAO.getAll();
            Collection<Task> validTasks = new ArrayList<>();

            // get only non-template not-finished tasks
            if (!includeCompleted) {
                for (Task task : allTasks) {
                    if (task.getStatus() != Status.DONE) {
                        validTasks.add(task);
                    }
                }
            } else { // get all the non-template tasks
                validTasks = allTasks;
            }

            return validTasks;
        }
    }
    
    public Task addTask(
        Task task
    ) {
        return this.addTask(task, true);
    }
    
    public Task addTask(
        Task task,
        final ActionInitiator initiator    
    ) {
        return this.addTask(task, initiator, true);
    }
    
    public Task addTask(
        Task task,
        boolean useWebsocket
    ) {
        return this.addTask(task, new ActionInitiator("expiryDB"), useWebsocket);
    }
    
    public Task addTask(
        Task task,
        final ActionInitiator initiator,
        boolean useWebsocket
    ) {
        this.taskDAO.add(task);
        
        Employee creator = this.employeeDAO
            .getByUsername(initiator.getUsername());
        // in case the task is emited by expiry DB, skip creator related logic
        if (creator != null) {
            creator.addCreatedTask(task);
        
            this.emailProcessor.handleTaskCreate(task, initiator);

            this.employeeDAO.update(creator.getUsername(), creator);
        }
        
        Task processedTask = this.taskDAO.add(task);
        
        if (useWebsocket) {
            // web socket used for push notifications
            super.sendMessageOverSocket(
                    processedTask,
                    PushType.CREATE,
                    initiator
            );
        }
 
        return processedTask;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Task addTask(
            Task task,
            @Context HttpServletRequest request
    ) {
        String username = request.getHeader("PrettyGood-User");
        
        return this.addTask(task, new ActionInitiator(username));
    }

    @Path("/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Task getTaskById(@PathParam("id") Long id) {
        return this.taskDAO.getById(id);
    }
    
    @Path("/{id}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Task updateTask(
            @PathParam("id") Long id,
            Task task
    ) {
        return updateTask(id, task, true);
    }
    
    public Task updateTask(
            @PathParam("id") Long id,
            Task task,
            boolean useWebsocket
    ) {
        this.emailProcessor.handleTaskUpdate(id, task);
        
        Task processedTask = this.taskDAO.update(id, task);

        // web socket used for push notifications
        if (useWebsocket) {
            super.sendMessageOverSocket(
                processedTask,
                PushType.UPDATE,
                new ActionInitiator()
            );
        }

        return processedTask;
    }

    @Path("/{id}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Task deleteTask(
            @PathParam("id") Long id,
            @Context HttpServletRequest request
    ) {
        return deleteTask(id, request, true);
    }
    
     public Task deleteTask(
            @PathParam("id") Long id,
            @Context HttpServletRequest request,
            boolean useWebsocket
    ) {
         String username = request.getHeader("PrettyGood-User");
        
        return deleteTask(id, new ActionInitiator(username), useWebsocket);
     }
     
     public Task deleteTask(
            @PathParam("id") Long id,
            ActionInitiator initiator,
            boolean useWebsocket
    ) {
         // web socket used for push notifications
        if (useWebsocket) {
            super.sendMessageOverSocket(
                id,
                PushType.DELETE,
                initiator
            );
        }
        
        this.emailProcessor.handleTaskDelete(id, initiator.getUsername());

        return this.taskDAO.delete(id);
     }
}
