# Totally Not Pictionary

For my final project at General Assembly, I developed an online pictionary-like game. Players can sign up and create rooms, friends can join that room (by sharing the room number) and play with a fully synchronized, real-time canvas. The server randomly allocates a word to draw, and a player to become the drawer.

## Built With

I built an API to store a list of words, users created and any room created to host a game of pictionary.
The API was created with Node.js, Socket.io, Express, MongoDB, and Mongoose. Postman was used for testing routes, locally, throughout development. And, ultimately the API was deployed via Heroku and the database was hosted on MongoDB Atlas.

The [back-end](https://github.com/ismailshak/pictionary-server) was extended by a front-end, created using React. This was deployed and hosted on Surge.

## Dependencies

Back-End: Express, Mongoose, Socket.io, CORS, Body-Parser
Front-End: Axios, React, React-Dom, React-Router-Dom, React-Scripts, React-Modal, Socket.io client

## Features

- Real-time drawing canvas
- Utilizes models for Users, Rooms, and Words with relevant data fields for each
- Server randomly picks a word for the session and a user to become the drawer
- Incorporates complete CRUD functionality implemented with RESTful routes

## Installation

1. Clone down this repo
2. Install dependencies ```npm install```
3. Start the server ```npm start```
4. If not redirected, navigate to ```localhost:3000``` on your browser

## Known Issues

1. Player's joining an active game are stuck on 'waiting for host', host has to restart the room
2. Rooms aren't destroyed when host leaves
3. No option to play another round, in the same room
