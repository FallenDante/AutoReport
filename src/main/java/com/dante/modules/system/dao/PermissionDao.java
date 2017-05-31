package com.dante.modules.system.dao;

import com.dante.common.persistence.CrudDao;
import com.dante.common.persistence.annotation.MyBatisDao;
import com.dante.modules.account.entity.Permission;


@MyBatisDao
public interface PermissionDao  extends CrudDao<Permission>{


}
