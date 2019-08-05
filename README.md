# Monopoly
This is a simple implementation of 2D Monopoly board game based on Websocket, NodeJS, Knex

# Intructions
## Online 
Log in to https://monopoly-project2.herokuapp.com/ to start Monopoly game with your friends!

## Offline
1. Clone the repository to your local folder. Change current directory to this folder in shell.
2. Install the dependent packages via npm using the following command:
> npm install
3. Create database using the following queries in your local MySQL server:
> DROP DATABASE IF EXISTS monopoly_db;
> CREATE DATABASE monopoly_db;
4. Migrate the preset db structure into your locally created monopoly_db using shell command:
> ./node_module/.bin/knex migrate:latest

> ./node_module/.bin/knex seed:run

5. Start the server locally using the following code in shell:
> node server.js

6. open your browser, log to localhost:8080. Now game is ON!

# Login Page
Type your name and then click "Start Game" to begin!
TODO: add the login page screenshot after the update merges

# Game Board
Roll the dice, buy the land, act like you are a millionare! :-)
TODO: add the board page screenshot after the udpate merges