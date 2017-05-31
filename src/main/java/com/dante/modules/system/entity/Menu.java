package com.dante.modules.system.entity;

import com.dante.common.persistence.BaseEntity;
import com.dante.modules.system.util.MenuComparator;

import java.util.*;


public class Menu extends BaseEntity<Menu> implements Comparator {

    private int menuID;
    private String menuName;
    private String menuUrl;
    private String moduleID;
    private int displayOrder;
    private int inUse;
    private int parentNo;
    private Set subMenusList = new TreeSet<Menu>(new MenuComparator());


    public Set getSubMenusList() {
        return subMenusList;
    }

    public void setSubMenusList(Set subMenusList) {
        this.subMenusList = subMenusList;
    }

    public int getParentNo() {
        return parentNo;
    }

    public void setParentNo(int parentNo) {
        this.parentNo = parentNo;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public int getInUse() {
        return inUse;
    }

    public void setInUse(int inUse) {
        this.inUse = inUse;
    }


    public int getMenuID() {
        return menuID;
    }

    public void setMenuID(int menuID) {
        this.menuID = menuID;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public String getMenuUrl() {
        return menuUrl;
    }

    public void setMenuUrl(String menuUrl) {
        this.menuUrl = menuUrl;
    }

    public String getModuleID() {
        return moduleID;
    }

    public void setModuleID(String moduleID) {
        this.moduleID = moduleID;
    }

    public int compare(Object first, Object second) {
        int firstOrder = ((Menu) first).getDisplayOrder();
        int secondOrder = ((Menu) second).getDisplayOrder();
        if (firstOrder > secondOrder) {
            return 1;
        }
        if (firstOrder < secondOrder) {
            return -1;
        }
        return 0;

    }


}
