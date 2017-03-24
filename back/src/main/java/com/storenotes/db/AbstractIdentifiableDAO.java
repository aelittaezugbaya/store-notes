/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.util.HibernateStuff;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author aleksandr
 */
public abstract class AbstractIdentifiableDAO<T> extends AbstractDAO<T> {
    
    private final Class<T> tClass;
    public AbstractIdentifiableDAO(Class<T> tClass) {
        super(tClass);
        this.tClass = tClass;
    }

        public T getById(Long id) {
        Session session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();
        
        List<T> objects = session.createCriteria(tClass)
                .add(Restrictions.eq("id", id))
                .list();
 
        session.getTransaction().commit();
        
        return objects.isEmpty()
                ? null
                : objects.get(0);
    }
        
    public T update(Long id, T object) {
        Session session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();

        List<T> updatables = session.createCriteria(tClass)
                .add(Restrictions.eq("id", id))
                .list();
        T updatable = updatables.get(0);
        
        updatable = updateFields(updatable, object);

        session.saveOrUpdate(updatable);

        session.getTransaction().commit();
        
        return updatable;
    }
    
    public T delete(Long id) {
        Session session = HibernateStuff.getInstance()
                .getSessionFactory()
                .openSession();
        session.beginTransaction();
        
        List<T> deletableObjects = session.createCriteria(tClass)
                .add(Restrictions.eq("id", id))
                .list();
        session.delete(deletableObjects.get(0));
 
        session.getTransaction().commit();
        
        return deletableObjects.isEmpty()
                ? null
                : deletableObjects.get(0);
    }
}
