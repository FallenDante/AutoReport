package com.dante.modules.system.util;

import com.dante.modules.system.entity.Menu;

import java.util.Comparator;

/**
 * Created by dante on 5/20/17.
 */
public class MenuComparator implements Comparator<Menu> {

    @Override
    public int compare(Menu firstMenu, Menu secondMenu) {
        // base on displayOrder attribute to sort
        return firstMenu.getDisplayOrder() - secondMenu.getDisplayOrder();
    }
}
