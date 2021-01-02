/*
SQLyog Ultimate v10.00 Beta1
MySQL - 8.0.22-0ubuntu0.20.04.3 : Database - skype_bot
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `skype_bot`;

/*Table structure for table `conversations` */

DROP TABLE IF EXISTS `conversations`;

CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` varchar(255) NOT NULL,
  `messageId` bigint NOT NULL,
  `originalarrivaltime` timestamp NULL DEFAULT NULL,
  `messagetype` varchar(100) DEFAULT NULL,
  `version` varchar(100) DEFAULT NULL,
  `composetime` timestamp NULL DEFAULT NULL,
  `skypeguid` varchar(100) DEFAULT NULL,
  `content` text,
  `conversationLink` varchar(900) DEFAULT NULL,
  `conversationid` varchar(100) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `from` varchar(900) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `conversations` */

/*Table structure for table `skype_contacts` */

DROP TABLE IF EXISTS `skype_contacts`;

CREATE TABLE `skype_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parentId` varchar(255) NOT NULL COMMENT 'puser_skype_username',
  `personId` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `phones` varchar(400) DEFAULT NULL,
  `avatarUrl` varchar(900) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL COMMENT '0 - male. 1 - fmale',
  `locations` text,
  `nickname` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `about` text,
  `website` varchar(900) DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_person_unique_id` (`personId`,`parentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `skype_contacts` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
