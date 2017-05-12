package com.dante.common.realm;

import com.dante.modules.account.entity.Account;
import com.dante.modules.account.entity.Permission;
import com.dante.modules.account.entity.Role;
import com.dante.modules.account.service.AccountService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dante on 2017/4/26.
 * 自定义shiro用户权限认证类
 */
public class MyRealm extends AuthorizingRealm {

    @Autowired
    private AccountService accountService;

    /**
     * 为当前登录的Subject授予角色和权限
     * 经测试:本例中该方法的调用时机为需授权资源被访问时
     * 经测试:并且每次访问需授权资源时都会执行该方法中的逻辑,这表明本例中默认并未启用AuthorizationCache
     * 个人感觉若使用了Spring3.1开始提供的ConcurrentMapCache支持,则可灵活决定是否启用AuthorizationCache
     * 比如说这里从数据库获取权限信息时,先去访问Spring 提供的缓存,而不使用Shior提供的AuthorizationCache
     */
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String userName = (String) super.getAvailablePrincipal(principals);
        List roleList = new ArrayList<String>();
        List permissionList = new ArrayList<String>();
        Account account = accountService.accountLogin(userName);
        for (Role role : account.getRoleList()) {
            if (null != role) {
                roleList.add(role.getName());
            }
        }
        for (Permission permission : account.getPermissionList()) {
            if (null != permission) {
                permissionList.add(permission.getName());

            }
        }

        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        authorizationInfo.addRoles(roleList);
        authorizationInfo.addStringPermissions(permissionList);
        return authorizationInfo;
    }

    /**
     * 验证当前登录的Subject
     * 经测试:本例中该方法的调用时机为LoginController.login()方法中执行Subject.login()时
     *
     * @param token
     * @return
     * @throws AuthenticationException
     */
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        //获取基于用户名和密码的令牌
        //实际上这个authcToken是从LoginController里面currentUser.login(token)传过来的
        UsernamePasswordToken userToken = (UsernamePasswordToken) token;
//        User user = userService.queryLogin(userToken.getUsername());
        Account account = accountService.accountLogin(userToken.getUsername());
        if (null != account) {
            AuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(account.getName(), account.getPwd(), "xx");
            this.setSession("currentUser", account);
            return authenticationInfo;
        } else {
            return null;
        }
        //此处无需比对,比对的逻辑Shiro会做,我们只需返回一个和令牌相关的正确的验证信息
        //说白了就是第一个参数填登录用户名,第二个参数填合法的登录密码()
        //这样一来,在随后的登录页面上就只有这里指定的用户和密码才能通过验证
    }

    private void setSession(Object key, Object value) {
        Subject subject = SecurityUtils.getSubject();
        Session session = subject.getSession();
        if (null != key) {
            session.setAttribute(key, value);
        }

    }
}
