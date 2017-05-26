package com.dante.common.persistence;

import java.io.Serializable;

/**
 * Created by dante on 2017/5/10.
 */
public abstract class BaseEntity<T> implements Serializable {
    private int delFlag;
    public int getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(int delFlag) {
        this.delFlag = delFlag;
    }

    public  static  final Integer DELETE_FLAG_NORMAL=1;
    public static final Integer DELETE_FLAG_DELETE=0;
}
