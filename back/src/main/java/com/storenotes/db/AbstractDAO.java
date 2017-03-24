/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.util.HibernateStuff;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.Session;

/**
 *
 * @author aleksandr
 * @param <T>
 */
public abstract class AbstractDAO<T> {
    
    private final Class<T> tClass;
    public AbstractDAO(Class<T> tClass) {
        this.tClass = tClass;
    }
    
    public T add(T object) {
        Session session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();

        session.saveOrUpdate(object);
        
        session.getTransaction().commit();
        
        return object;
    }
    
    public Collection<T> getAll() {
        Session session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();
        
        Set<T> objects = new HashSet<>(session.createCriteria(tClass)
                .list());
 
        session.getTransaction().commit();
        
        return objects;
    }
    
    public abstract T updateFields(T updatable, T newObject);
}
