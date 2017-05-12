package com.dante.modules.account.dao;

import com.dante.common.persistence.annotation.MyBatisDao;
import com.dante.modules.account.entity.Account;

/**
 * Created by dante on 2017/5/11.
 */
@MyBatisDao //-----annotation to scan
public interface AccountDao {
    Account queryToLogin(String name);
}
