package com.dante.modules.account.entity;

import com.dante.common.persistence.BaseEntity;

/**
 * Created by dante on 2017/4/26.
 */
public class Permission  extends BaseEntity {
    private int id;
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
