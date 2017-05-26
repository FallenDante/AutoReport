package com.dante.common.persistence;

import java.util.List;

/**
 * Created by dante on 2017/5/22.
 */
public interface CrudDao<T> extends BaseDao {
    /**
     * 插入一个对象
     * @param entity
     * @return 主键
     */
    int insert(T entity);

    int update(T entity);

    int delete(int id);

    int delete(T entity);

    T get(int id);

    /**
     * 通过实体对象条件进行查询
     * @param entity
     * @return
     * TODO,方法名相同，尝试使用parameterType设定参数类型进行划分
     */
    T get(T entity);

    List<T> findList(T entity);



}
