package com.dante.modules.system.dao;

import com.dante.common.persistence.CrudDao;
import com.dante.common.persistence.annotation.MyBatisDao;
import com.dante.modules.account.entity.Role;

import java.util.List;

/**
 * Created by dante on 2017/5/23.
 */
@MyBatisDao
public interface RoleDao extends CrudDao<Role> {

    /**
     * 刪除角色和权限的关联
     * @param roleID
     * @return
     */
    int delPermissionRelation(int roleID);

    /**
     * 删除角色和模块的关联
     * @param roleID
     * @return
     */
    int delModuleRelation(int roleID);

    /**
     * 插入角色和权限的关系
     * @param roleID
     * @param permissionIDs
     * @return
     */
    int insertPermissionRelation(int roleID, List<Integer> permissionIDs);

    /**
     * 插入角色和模块的关系
     * @param roleID
     * @param moduleIDs
     * @return
     */
    int insertModuleRelation(int roleID,List<Integer> moduleIDs);

}
