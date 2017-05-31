package com.dante.modules.selfquery.dao;

import com.dante.common.persistence.CrudDao;
import com.dante.common.persistence.annotation.MyBatisDao;

import java.util.List;
import java.util.Map;


@MyBatisDao
public interface SelfQueryDao  {
    /**
     * 获得当前SQL语句查询数量
     * @param sqlClause
     * @return
     */
    int getQueryCount(String sqlClause);

    /**
     * 获得自定义查询语句的结果。
     * @param sql
     * @return
     * TODO check
     */
    List<Map<String,Object>> getSqlQueryResult(String sql);
}
