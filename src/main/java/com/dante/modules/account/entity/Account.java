package com.dante.modules.account.entity;

import com.dante.common.persistence.BaseEntity;
import com.dante.modules.system.entity.Menu;

import java.util.List;
import java.util.TreeSet;

/**
 * Created by dante on 2017/4/27.
 */
public class Account extends BaseEntity<Account> {
    private int id;
    private String name;
    private String pwd;
    private List<Role> roleList;
    private List<Permission> permissionList;
    private TreeSet<Menu> menus;

    public TreeSet<Menu> getMenus() {
        return menus;
    }

    public void setMenus(TreeSet<Menu> menus) {
        this.menus = menus;
    }





    public List<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<Role> roleList) {
        this.roleList = roleList;
    }

    public List<Permission> getPermissionList() {
        return permissionList;
    }

    public void setPermissionList(List<Permission> permissionList) {
        this.permissionList = permissionList;
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

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }


}
