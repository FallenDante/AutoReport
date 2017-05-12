package com.dante.modules.account.controller;

import com.dante.modules.account.service.AccountService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by dante on 2017/5/11.
 */
@Controller // annotation to scan
public class MainController {
    @Autowired
    private AccountService accountService;


    @RequestMapping(value = "login.do", method = RequestMethod.GET)
    public String login() {
        UsernamePasswordToken token = new UsernamePasswordToken("DANTE", "123");
        token.setRememberMe(true);
        Subject subject = SecurityUtils.getSubject();
        try {
            subject.login(token);
        } catch (Exception e) {
            System.out.print("Exception raises!");
        }
        if (subject.isAuthenticated()) {
            System.out.print("用户验证通过，可以使用初始化参数");
        } else {
            token.clear();
        }

        return "login_success";
    }

    @RequestMapping(value = "logout.do", method = RequestMethod.GET)
    public String loginOut(){
        SecurityUtils.getSubject().logout();
        return "logout_success";
    }


    @RequiresPermissions("system:read")
    @RequestMapping(value = "permissionTest.do", method = RequestMethod.GET)
    public String permission_test() {
        if (accountService.permissionRequire()) {
            return "permission_pass";
        } else {
            return "permission_fail";
        }
    }
}
