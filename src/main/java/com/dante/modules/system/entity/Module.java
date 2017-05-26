package com.dante.modules.system.entity;

import com.dante.common.persistence.BaseEntity;

/**
 * Created by dante on 5/13/17.
 */
public class Module extends BaseEntity<Module> {
    private int moduleID;
    private String moduleName;

    public int getModuleID() {
        return moduleID;
    }

    public void setModuleID(int moduleID) {
        this.moduleID = moduleID;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }
}