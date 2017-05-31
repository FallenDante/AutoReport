package com.dante.modules.selfquery.controller;

import com.dante.modules.selfquery.dao.SelfQueryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.supercsv.io.*;
import org.supercsv.prefs.CsvPreference;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RequestMapping(value = "/autoReport/csv/")
@Controller
public class CsvController {


    @Autowired
    private SelfQueryDao selfQueryDao;

    //注：此处直接返回一个hashmap即可，其中的键是列名，值便是结果行中的对应值。这种使用足以应付自定义sql，不必使用jdbctemplate
    @RequestMapping(value = "getCsvFile")
    public void getCsvFile(HttpServletResponse response,String[] headers,String sqlClause) throws IOException{
//        ICsvBeanWriter beanWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
        ICsvMapWriter mapWriter = new CsvMapWriter(response.getWriter(),CsvPreference.STANDARD_PREFERENCE);
        mapWriter.writeHeader(headers);

        //返回 List<Map<String ,Object>>对象，使用迭代器取出
        List<Map<String,Object>> queryResult = selfQueryDao.getSqlQueryResult(sqlClause);
        Iterator iterator = queryResult.iterator();

        while (iterator.hasNext()){
            Map rowMap = (Map) iterator.next();
            mapWriter.write(rowMap,headers);
        }
        mapWriter.close();
    }
}
