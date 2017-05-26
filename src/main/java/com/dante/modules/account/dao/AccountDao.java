package com.dante.modules.account.dao;

import com.dante.common.persistence.CrudDao;
import com.dante.common.persistence.annotation.MyBatisDao;
import com.dante.modules.account.entity.Account;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by dante on 2017/5/11.
 */
@MyBatisDao //-----annotation to scan
public interface AccountDao extends CrudDao<Account> {
    Account queryToLogin(String name, String pwd);

    /**
     * login only
     *
     * @param name
     * @param pwd
     * @return
     */
    Account findAccount(String name, String pwd);

    /**
     * account basic
     * @param name
     * @param pwd
     * @return
     */
//    Account queryAccount(String name, String pwd);

    /**
     * query account message
     *
     * @param name
     * @return
     */
    Account queryAccountMsg(String name);

    /**
     * 插入用户与角色关系
     * @param accountID
     * @param roleIDS
     * @return
     * TODO test 需要注释吗
     */
    int insertRoleRelation(@Param("accountID") int accountID, @Param("roleIDs") List<Integer> roleIDS);

    /**
     * 刪除account 相关的account - role 关系
     * @param accountID
     * @return
     */
    int deleteRoleRelation(int accountID);




}
