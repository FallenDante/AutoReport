package com.dante.modules.system.service;

import com.dante.modules.system.dao.SystemDao;
import com.dante.modules.system.entity.Menu;
import com.dante.modules.system.util.MenuComparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by dante on 5/20/17.
 */
@Service
public class SystemService {

    @Autowired
    private SystemDao systemDao;

    public TreeSet<Menu> getAccountMenus(int accountID) {
        List<Menu> basicMenus = systemDao.queryAccountMenu(accountID);
        return this.sortMenus(basicMenus);
    }

    private TreeSet<Menu> sortMenus(List<Menu> basicMenus) {
        Map menusMap = new HashMap<Integer, Menu>();
        //存放父级菜单节点
        for (Menu item : basicMenus) {
            if (item.getParentNo() == 1) {
                menusMap.put(item.getMenuID(), item);
            }
        }
        // 将子菜单放入父菜单下
        for (Menu item : basicMenus) {
            if (menusMap.containsKey(item.getParentNo())) {
                ((Menu) menusMap.get(item.getParentNo())).getSubMenusList().add(item);
            }
        }

        // sort menus and return
        TreeSet<Menu> menusTree = new TreeSet<Menu>(new MenuComparator());
        menusTree.addAll(menusMap.values());
        return menusTree;
    }
}
