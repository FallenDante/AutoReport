/*
Navicat MySQL Data Transfer

Source Server         : local_mysql
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : auto_report_fact

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-05-24 18:00:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ftbl_fact_vv
-- ----------------------------
DROP TABLE IF EXISTS `ftbl_fact_vv`;
CREATE TABLE `ftbl_fact_vv` (
  `fdim_fday` varchar(255) DEFAULT NULL,
  `ffact_vv` int(11) DEFAULT NULL,
  `fdim_company` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ftbl_fact_vv
-- ----------------------------
