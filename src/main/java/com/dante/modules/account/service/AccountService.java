package com.dante.modules.account.service;

import com.dante.modules.account.dao.AccountDao;
import com.dante.modules.account.entity.Account;
import com.dante.modules.system.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by dante on 2017/5/10.
 */

@Transactional(readOnly = true)
@Service //-----annotation to scan
public class AccountService   {
    @Autowired
    private AccountDao accountDao;

    // transactional的类内，使用别的service类，带事务，不能直接使用Autowire 进行注入。这与spring的代理机制有关
    // 采用的办法是：另建一个类，持有Spring ApplicationContext,随时随地获得spring注册的类
    //    @Autowired
    private SystemService systemService;



    //TODO to be deleted
//    public Boolean accountLogin(String name, String pwd) {
//
//        UsernamePasswordToken token = new UsernamePasswordToken(name, pwd);
//        token.setRememberMe(true);
//        Subject subject = SecurityUtils.getSubject();
//        try {
//            subject.login(token);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        if (subject.isAuthenticated()) {
//            return true;
//        } else {
//            return false;
//        }
//
//    }

    public Account findAccount(String name, String pwd) {
        Account account = accountDao.findAccount(name, pwd);
        return account;
    }


    /**
     * 查询用户信息，包含角色和权限
     * @param name
     * @return
     */
    public Account roleAndPermission(String name) {
        Account account = accountDao.queryAccountMsg(name);
//        account.setMenuList(systemService.getAccountMenus(account.getId()));
        return account;
    }

    /**
     * 查询当前登录用户信息
     * 包括权限，菜单等
     * @param name
     * @return
     */
    public Account loginedAccount(String name){
        Account account = this.roleAndPermission(name);
//        account.setMenus(systemService.getAccountMenus(account.getId()));
        return account;
    }



    /**
     * 添加用户,及相关角色
     * @param account
     * @param roleIDs
     * @return
     */
//    @Transactional(readOnly = false ,propagation = Propagation.REQUIRED )
    public Account addAccount(Account account, List<Integer> roleIDs) {

        try{

            if (null!=account){
                int newID = accountDao.insert(account);
                account.setId(newID);
            }

            int i = 1/0;

            if(null!=roleIDs && roleIDs.size()>0){
                accountDao.insertRoleRelation(account.getId(),roleIDs);
            }
        }catch (Exception e){
            throw e;
        }


        return account;
    }


    //    @RequiresPermissions("system:write")
    public boolean permissionRequire() {
        return true;
    }
}
