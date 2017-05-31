package com.dante.modules.system.dao;

import com.dante.common.persistence.annotation.MyBatisDao;
import com.dante.modules.system.entity.Menu;

import java.util.List;


@MyBatisDao
public interface SystemDao {
    List<Menu> queryAccountMenu(int accountID);


}
