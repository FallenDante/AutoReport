package com.dante.modules.account.controller;

import com.dante.common.mapper.JasonMapper;
import com.dante.common.web.SimpleResponse;
import com.dante.modules.account.entity.Account;
import com.dante.modules.account.service.AccountService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by dante on 5/20/17.
 */
@Controller
@RequestMapping(value = "/autoReport/account/")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @ResponseBody
    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String login(Account account, Model model) {
//        boolean loginResult = accountService.accountLogin(account.getName(), account.getPwd());
        UsernamePasswordToken token = new UsernamePasswordToken(account.getName(), account.getPwd());
        token.setRememberMe(true);
        Subject subject = SecurityUtils.getSubject();
        try {
            subject.login(token);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (subject.isAuthenticated()) {
            SimpleResponse res = new SimpleResponse(SimpleResponse.RESPONSE_SUCCESS);
            return JasonMapper.defaultMapper().toJson(res);
        } else {
            SimpleResponse res = new SimpleResponse(SimpleResponse.RESPONSE_FAIL);
            return JasonMapper.defaultMapper().toJson(res);
        }
    }


}
