package com.dante.modules.account.service;

import com.dante.modules.account.dao.AccountDao;
import com.dante.modules.account.entity.Account;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by dante on 2017/5/10.
 */
@Service //-----annotation to scan
public class AccountService {
    @Autowired
    private AccountDao accountDao;

    public Account accountLogin(String name) {
        return accountDao.queryToLogin(name);
    }

//    @RequiresPermissions("system:write")
    public boolean permissionRequire() {
        return true;
    }
}
