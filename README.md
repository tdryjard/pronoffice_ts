# pronoffice_ts Thomas Dryjard 03/08/2020

## Pronoffice :

Application web permettant de créer et vendre son abonnement à son télégram privé, à destination des pronostiqueur sportif

Mobile First, responsive pc pas encore réalisé (priorité mobile pour PWA)

## Installation modules :

cd front && npm i

cd back && npm i

## Configuration base de donnée dans mysql : 

DROP DATABASE pronoffice IF EXISTS;

CREATE DATABASE pronoffice;

use pronoffice

CREATE TABLE user (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    pseudo VARCHAR(255) NULL,
    password VARCHAR(255) NULL
);

CREATE TABLE image (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    base mediumtext NULL,
    user_id INT NULL
);

CREATE TABLE premium (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NULL,
    description VARCHAR(255) NULL,
    price VARCHAR(255) NULL,
    telegram VARCHAR(255) NULL,
    pronostiqueur VARCHAR(255) NULL,
    rib VARCHAR(255) NULL,
    product_id VARCHAR(255) NULL,
    price_id VARCHAR(255) NULL,
    user_id INT NULL,
    image_id INT NULL
);

CREATE TABLE subscriber (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    user_id INT NULL,
    customer_id VARCHAR(255) NULL
);

## Création variables environnement back :

cd back && touch .env

DB_HOST=localhost

DB_PORT=8000

DB_NAME=pronoffice

DB_USER="mysql username"

DB_PASSWORD="mysql password"

SECRET_KEY="read a secret key"

STRIPE_SECRET_KEY="your secret key API stripe"

ORIGIN_URL=http://localhost:3000

## Lancer le project :

cd front && npm start

cd back && npm start

Bonne utilisation ;)
