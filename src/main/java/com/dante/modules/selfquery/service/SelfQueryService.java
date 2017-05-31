package com.dante.modules.selfquery.service;

import com.dante.modules.selfquery.dao.SelfQueryDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SelfQueryService {

    @Autowired
    private SelfQueryDao selfQueryDao;


    @Transactional(readOnly = true )
    public Map<String ,Object> getSqlQueryData(String sqlClause,int page,int rows){
        Map resultMap = new HashMap<String ,Object>();
        int totalRecord = selfQueryDao.getQueryCount(sqlClause);
        int offset = (page-1)*rows;
        int limitSum = (page * rows <= totalRecord)? rows:(totalRecord / rows + 1);
        resultMap.put("records",totalRecord);
        resultMap.put("total_page",(totalRecord % rows == 0)? totalRecord:(totalRecord / rows + 1));
        resultMap.put("current_page",page);
        sqlClause += " limit " +  String.valueOf(limitSum) + " offset " + String.valueOf(offset);
        List queryData = selfQueryDao.getSqlQueryResult(sqlClause);
        resultMap.put("grid_data",queryData);
        return resultMap;
    }
}
