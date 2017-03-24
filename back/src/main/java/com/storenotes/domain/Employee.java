/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.domain;

import com.storenotes.auth.User;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

/**
 *
 * @author blaze
 */
@Entity
@XmlRootElement
public class Employee extends User implements Serializable {
    private String name;
    private Rank rank;
    private List<Task> tasks;
    private List<Task> createdTasks;

    public Employee() {
        this("", "", "", "", Rank.WORKER);
    }
    
    public Employee(
            String username,
            String password,
            String email,
            String name,
            Rank rank
    ) {
        super(username, password, email);
        this.name = name;
        this.rank = rank;
        
        this.tasks = new ArrayList<>();
        this.createdTasks = new ArrayList<>();
    }
    
    @Basic
    @XmlElement
    public Rank getRank() {
        return this.rank;
    }
    public void setRank(Rank rank) {
        this.rank = rank;
    }

    @Basic
    @XmlElement
    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    @ManyToMany(targetEntity = Task.class,
            fetch = FetchType.EAGER)
    @JoinTable(name = "Employee_AssignedTask")
    // @Cascade({CascadeType.MERGE, CascadeType.PERSIST})
    @XmlElement
    public List<Task> getTasks() {
        return this.tasks;
    }
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
    
    @OneToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "creator")
    @XmlElement
    public List<Task> getCreatedTasks() {
        return this.createdTasks;
    }
    public void setCreatedTasks(List<Task> createdTasks) {
        this.createdTasks = createdTasks;
    }
    
    public void addTask(Task task) {
        this.tasks.add(task);
    }
    
    public void addCreatedTask(Task task) {
        this.createdTasks.add(task);
    }
    
    public void removeTask(Long id) {
        Iterator<Task> iterator = this.tasks.iterator();
        
        while(iterator.hasNext()) {
            if (Objects.equals(iterator.next().getId(), id)) {
                iterator.remove();
            }
        }
    }
    
    public void removeCreatedTask(Long id) {
        Iterator<Task> iterator = this.createdTasks.iterator();
        
        while(iterator.hasNext()) {
            if (Objects.equals(iterator.next().getId(), id)) {
                iterator.remove();
            }
        }
    }
}
