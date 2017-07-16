-- MySQL Script generated by MySQL Workbench
-- Sun Jul 16 14:41:00 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema cordelia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cordelia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cordelia` DEFAULT CHARACTER SET utf8 ;
USE `cordelia` ;

-- -----------------------------------------------------
-- Table `cordelia`.`players`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cordelia`.`players` (
  `discordid` INT UNSIGNED NOT NULL,
  `name` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`discordid`),
  UNIQUE INDEX `idplayers_UNIQUE` (`discordid` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cordelia`.`rankings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cordelia`.`rankings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `discordid` INT UNSIGNED NOT NULL,
  `format` VARCHAR(16) NOT NULL,
  `r` DOUBLE NOT NULL,
  `rd` DOUBLE NOT NULL,
  `vol` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cordelia`.`matches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cordelia`.`matches` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `timestamp` TIMESTAMP NOT NULL,
  `format` VARCHAR(16) NOT NULL,
  `player1` INT NOT NULL,
  `player2` INT NOT NULL,
  `winner` INT NOT NULL,
  `confirmationcode` VARCHAR(6) NOT NULL,
  `confirmed` TINYINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
