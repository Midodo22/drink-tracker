CREATE DATABASE hw4_userbase;
USE hw4_userbase;

CREATE TABLE  userdata  (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(45) NOT NULL,
    password varchar(45) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY  id_UNIQUE  (id)
);

CREATE TABLE  categories  (
    name varchar(50) NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE  tasks  (
    username varchar(45) NOT NULL REFERENCES userdata(username),
    name varchar(50) NOT NULL,
    description varchar(200),
    category varchar(50) DEFAULT 'none' REFERENCES categories(name),
    deadline DATE,
    completed BOOL DEFAULT 0,
    PRIMARY KEY (name)
);

INSERT INTO userdata(username, password) VALUES ("cvml", "dwpcvml2025");

INSERT INTO tasks (username, name, description, deadline)
VALUES ("cvml", "Template", "This is a template :D", "2028-11-11");

INSERT INTO tasks (username, name, description, deadline)
VALUES ("cvml", "Incomplete tasks", "Incomplete", "2025-12-31");

INSERT INTO tasks (username, name, description, deadline)
VALUES ("cvml", "Idk what to put anymore", "PHP is a popular, open-source scripting language mainly used in web development.", "2026-04-28");

INSERT INTO categories(name) VALUES ("none");
