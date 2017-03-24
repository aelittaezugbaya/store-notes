/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.storenotes.db;

import com.storenotes.domain.StoreSection;

/**
 *
 * @author aleksandr
 */
public class StoreSectionDAO extends AbstractIdentifiableDAO<StoreSection> {
    public StoreSectionDAO() {
        super(StoreSection.class);
    }
    
    @Override
    public StoreSection updateFields(
            StoreSection updatable,
            StoreSection newObject
    ) {
        updatable.setName(newObject.getName());
        
        return updatable;
    }
}
