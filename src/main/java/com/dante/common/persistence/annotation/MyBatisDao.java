package com.dante.common.persistence.annotation;

import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Created by dante on 2017/5/10.
 * 自定义标签，方便{@link org.mybatis.spring.mapper.MapperScannerConfigurer}的扫描。
 * 从配置中解耦
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Component
public @interface MyBatisDao {
    String value() default "";
}
