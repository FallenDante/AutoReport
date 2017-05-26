package com.dante.modules.admin.controller;

import com.dante.modules.account.entity.Account;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by dante on 2017/5/22.
 */
@Controller
@RequestMapping(value = "/autoReport/admin/")
public class adminController {

    @RequestMapping(value = "addAccount")
    public String addAccount(String roleIDs, Account account, Model model) {

        return "";
    }

}
