package com.dante.modules.system.dao;

import com.dante.common.persistence.CrudDao;
import com.dante.common.persistence.annotation.MyBatisDao;
import com.dante.modules.account.entity.Permission;

/**
 * Created by dante on 2017/5/23.
 */
@MyBatisDao
public interface PermissionDao  extends CrudDao<Permission>{


}
