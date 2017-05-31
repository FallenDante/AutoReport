package com.dante.modules.system.controller;

import com.dante.modules.account.entity.Account;
import com.dante.modules.account.service.AccountService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping(value = "/autoReport/")
public class SystemController {

    @Autowired
    private AccountService accountService;

    @RequiresPermissions(value = "system:view")
    @RequestMapping(value = "index")
    public String index(String userName, Model model) {
        Account account = accountService.loginedAccount(userName);
        model.addAttribute("loginedAccount",account);
        return "index";
    }
}
