/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.APIResources;

import com.storenotes.db.StoreSectionDAO;
import com.storenotes.db.TaskDAO;
import com.storenotes.domain.StoreSection;
import com.storenotes.domain.Task;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author aleksandr
 */
@Path("/sections")
public class SectionResource {
    private final StoreSectionDAO sectionDAO;
    private final TaskDAO taskDAO;
    
    public SectionResource() {
        this.sectionDAO = new StoreSectionDAO();
        this.taskDAO = new TaskDAO();
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<StoreSection> getSections() {
        return this.sectionDAO.getAll();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Collection<StoreSection> addSection(StoreSection section) {
        this.sectionDAO.add(section);
        return this.getSections();
    }
 
    @Path("/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public StoreSection getSectionById(@PathParam("id") Long id) {
        return this.sectionDAO.getById(id);
    }
    
    @Path("/{id}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Collection<StoreSection> updateSection(@PathParam("id") Long id, StoreSection section) {
        this.sectionDAO.update(id, section);
        return this.getSections();
    }
    
    @Path("/{id}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public StoreSection deleteSection(@PathParam("id") Long id) {
        return this.sectionDAO.delete(id);
    }
}
