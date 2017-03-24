/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.auth;

import com.storenotes.db.EmployeeDAO;
import com.storenotes.db.TaskDAO;
import com.storenotes.domain.Employee;
import com.storenotes.domain.Rank;
import com.storenotes.domain.Task;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Objects;
import java.util.StringTokenizer;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import org.jvnet.hk2.annotations.Service;

/**
 *
 * @author aleksandr
 */
@Service
@WebFilter(filterName="authFilter", urlPatterns="/webresources/*")
public class AuthFilter implements Filter {
    
    private UserDAO userDAO;
    private EmployeeDAO employeeDAO;
    private TaskDAO taskDAO;
    
    @Override
    public void init(FilterConfig fc) throws ServletException {
        this.initDAOs();
    }

    @Override
    public void doFilter(
            ServletRequest sr,
            ServletResponse sr1,
            FilterChain fc
    ) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) sr;
        HttpServletResponse response = (HttpServletResponse) sr1;
        
        HeaderMapRequestWrapper requestWrapper = new HeaderMapRequestWrapper(request);

        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null) {
            StringTokenizer st = new StringTokenizer(authHeader);
            if (st.hasMoreTokens()) {
                String basic = st.nextToken();

                if (basic.equalsIgnoreCase("Basic")) {
                    try {
                        String credentials = new String(Base64.decode(st.nextToken()), "UTF-8");
                        int p = credentials.indexOf(":");
                        if (p != -1) {
                            String username = credentials.substring(0, p).trim();
                            String passwordPlain = credentials.substring(p + 1).trim();
                            
                            String password = PasswordHasher.hashPassword(passwordPlain);

                            requestWrapper.addHeader("PrettyGood-User", username);

                            if  (!isAuthenticated(
                                    username,
                                    password) ||
                                !isAuthorized(
                                    username,
                                    request.getRequestURI(),
                                    request.getMethod()
                                )
                            ) {
                                unauthorized(response, "Bad credentials");
                            } else {
                                fc.doFilter(requestWrapper, sr1);
                            } 
                        } else {
                            unauthorized(response, "Invalid authentication token");
                        }
                    } catch (Exception e) {
                        throw new Error("Couldn't retrieve authentication", e);
                    }
                }
            }
        } else {
            unauthorized(response);
        }
    }

    @Override
    public void destroy() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setHeader("WWW-Authenticate", "Basic authorization");
        response.sendError(401, message);
    }
    
    private void unauthorized(HttpServletResponse response) throws IOException {
        unauthorized(response, "Unauthorized");
    }
    
    private boolean isAuthenticated(
            String username,
            String password
    ) {
        User user = this.userDAO.getByUsername(username);
        System.out.println("Authentication...");
        System.out.println("username " + username);
        System.out.println("password " + password);
        
        return user != null &&
                user.getPassword().equals(password);
    }
    
    private boolean isAuthorized(
            String username,
            String url,
            String method
    ) {
        Employee employee = this.employeeDAO.getByUsername(username);
        System.out.println("Authorization...");
        
        if (employee == null) {
            return false;
        }
        
        Rank rank = employee.getRank();
        
        if (rank == Rank.WORKER) {
            if (url.matches("/back/webresources/tasks/([0-9]+)") &&
                    method.equals("DELETE")) {                
                String[] parts = url.split("/");
                Long taskId = Long.parseLong(parts[parts.length - 1]);
                
                Task task = this.taskDAO.getById(taskId);
                 
                // if the task is appeal and is assigned to the user, he/she can 
                // delete it (rejection)
                if (task.isAppeal()) {
                    for (Task assignedTask : employee.getTasks()) {
                        if (Objects.equals(assignedTask.getId(), task.getId())) {
                            return true;
                        }
                    }
                } else {
                // if the task is not appeal and created by the person, it can be deleted
                    for (Task createdTask : employee.getCreatedTasks()) {
                        if (Objects.equals(createdTask.getId(), task.getId())) {
                            return true;
                        }
                    } 
                }
                // if the task is not among ones created by the person, forbid
                // further action
                return false;
            }

            if (url.matches("/back/webresources/employees/([a-zA-Z0-9]+)") &&
                    method.equals("DELETE")) {
                return url.equals("/back/webresources/employees");
            }

            if (url.matches("/back/webresources/sections/([0-9]+)") &&
                    !method.equals("GET")) {
                return false;
            }
            
            if (url.matches("/back/webresources/employees[/]?") &&
                    method.equals("POST")) {
                return false;
            }
        }
        
        return true;
    }
    
    private void initDAOs() {
        this.userDAO = new UserDAO();
        this.employeeDAO = new EmployeeDAO();
        this.taskDAO = new TaskDAO();
    }
  
}
