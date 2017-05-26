package com.dante.common.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by dante on 2017/5/17.
 */
public class JasonMapper extends ObjectMapper {

    private static JasonMapper mapper;
    private static Logger logger = LoggerFactory.getLogger(JasonMapper.class);

    public JasonMapper() {

    }

    /**
     * 提供单例
     *
     * @return
     */
    public static JasonMapper defaultMapper() {
        if (mapper == null) {
            mapper = new JasonMapper();
        }
        return mapper;
    }

    public String toJson(Object o) {
        try {
            return this.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            logger.warn("parse json string error:" + o, e);
            return null;
        }

    }


}
