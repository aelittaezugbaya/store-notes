/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author blaze
 */
@Entity
@XmlRootElement
public class Task implements Serializable {

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 97 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Task other = (Task) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

    private Long id;
    private String name;
    private String description;
    private Status status;
    private boolean urgent;
    private boolean appeal;
    private StoreSection section;
    private long creationTime;
    private long dueTime;
    @JsonIgnore
    private Set<Employee> assignees;
    private boolean template;

    public Task() {
        this("");
    }
    
    public Task(String name) {
        this(name, "task description");
    }

    public Task(String name, String description) {
        this.name = name;
        this.description = description;
        this.creationTime = new Date().getTime();
        this.status = Status.NEW;
        this.urgent = false;
        this.appeal = false;
        this.template = false;
    }

    @Id
    @GeneratedValue
    @XmlElement
    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    @Basic
    @XmlElement
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @XmlElement
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    @ManyToOne(targetEntity=StoreSection.class)
    @XmlElement
    public StoreSection getSection() {
        return this.section;
    }
    public void setSection(StoreSection section) {
        this.section = section;
    }

    @Basic
    @XmlElement
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }

    @Column(name = "createTime")
    @XmlElement
    public long getCreationTime() {
        return this.creationTime;
    }
    public void setCreationTime(long creationTime) {
        this.creationTime = creationTime;
    }

    @Column(name = "dueTime")
    @XmlElement
    public long getDueTime() {
        return this.dueTime;
    }
    public void setDueTime(long dueTime) {
        if (dueTime <= 0) {
            return;
        }

        // make sure due time is later than creationTime
        this.dueTime = (
                this.creationTime != 0L &&
                dueTime >= this.creationTime
            )
            ? dueTime
            : this.creationTime == 0L
                ? dueTime
                : this.creationTime + 3600000;
    }

    @Basic
    @XmlElement
    public boolean isUrgent() {
        return this.urgent;
    }
    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }

    @Basic
    @XmlElement
    public boolean isAppeal() {
        return this.appeal;
    }
    public void setAppeal(boolean appeal) {
        this.appeal = appeal;
    }
    
    @ManyToMany(fetch = FetchType.EAGER,
            mappedBy="tasks",
            targetEntity=Employee.class)
    @XmlTransient
    public Set<Employee> getAssignees() {
        return this.assignees;
    }
    public void setAssignees(Set<Employee> assignees) {
        this.assignees = assignees;
    }
    
    @Basic
    @XmlElement
    public boolean isTemplate() {
        return this.template;
    }
    public void setTemplate(boolean template) {
        this.template = template;
    }
}
