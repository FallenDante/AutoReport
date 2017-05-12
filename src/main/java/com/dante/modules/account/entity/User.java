package com.dante.modules.account.entity;

import com.dante.common.persistence.BaseEntity;

import java.util.List;

/**
 * Created by dante on 2017/4/12.
 */
public class User  extends BaseEntity {
    private int id;
    private String name;
    private String pwd;
    private List<Permission> permissionList;
    private List<Role> roleList;

    public List<Permission> getPermissionList() {
        return permissionList;
    }

    public void setPermissionList(List<Permission> permissionList) {
        this.permissionList = permissionList;
    }

    public List<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<Role> roleList) {
        this.roleList = roleList;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

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
