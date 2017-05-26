package com.dante.modules.selfquery.controller;

import com.dante.common.mapper.JasonMapper;
import com.dante.modules.selfquery.service.SelfQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * Created by dante on 2017/5/25.
 */
@RequestMapping(value = "/auto_report_lib/selfquery/")
@Controller
public class SelfQueryController {

    @Autowired
    private SelfQueryService selfQueryService;

    @RequestMapping(value = "getTableQueryData")
    @ResponseBody
    public String getTableQueryData(int page,int rows,String sqlClause){

       Map resultMap = selfQueryService.getSqlQueryData(sqlClause,page,rows);
       return JasonMapper.defaultMapper().toJson(resultMap);
    }



}
