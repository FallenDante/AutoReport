/*
Navicat MySQL Data Transfer

Source Server         : local_mysql
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : auto_report_dim

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-05-24 18:00:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ftbl_dim_test
-- ----------------------------
DROP TABLE IF EXISTS `ftbl_dim_test`;
CREATE TABLE `ftbl_dim_test` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `fkey` varchar(255) DEFAULT NULL,
  `fnote` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ftbl_dim_test
-- ----------------------------
