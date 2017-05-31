package com.dante.common.service;

import org.springframework.transaction.annotation.Transactional;

/**
 * Created by dante on 2017/5/27.
 */
@Transactional(readOnly = true)
public abstract class BaseService {
}
