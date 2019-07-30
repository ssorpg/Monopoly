USE monopoly_db;

CREATE TABLE users
(
    id INT(10) NOT NULL
    AUTO_INCREMENT,
    username VARCHAR
    (255) NOT NULL,
    money INT
    (10) NOT NULL,
    PRIMARY KEY
    (id)
);

    INSERT INTO users
        (username, money)
    VALUES
        ('Jon', 1000),
        ('Jeremy', 1000),
        ('Mengyuan', 1000);