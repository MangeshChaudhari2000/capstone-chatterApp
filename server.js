import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';
import ejsLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import session from 'express-session';
import { Server } from 'socket.io';
import cors from 'cors';

import { connectToMongoDB } from './utlis/mongoose.config.js';
import userRoute from './routes/user.route.js';
import { UserController } from './controllers/user.controller.js';
import UserRepositories from './repositories/user.repository.js';
import chatRoute from './routes/chat.route.js';
import ChatRepositories from './repositories/chat.repository.js';

const app = express();

//middleware
app.use(express.urlencoded({ extended: true }))

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), "src", "views"));
app.use(ejsLayouts)
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/', userRoute)
app.use('/chat/', chatRoute)


const userRepositories = new UserRepositories();
const chatRepositories = new ChatRepositories();

//Socket Starts
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// Define a namespace
const userChatNsp = io.of('/userchat');
// Listen for connection events within the namespace
userChatNsp.on('connection', async (socket) => {
  console.log("user connected");
  const userId = socket.handshake.auth.token;
  try {
    const change = await userRepositories.updateIsOnline(userId._id, '1');
    console.log(change.is_online);
    socket.broadcast.emit('user_online_event', userId._id);

  

    //load old chat
    socket.on('existingChat', async(data) => {
      console.log("into existing chat");
      const getChat= await chatRepositories.getChat(data.sender_id,data.receiver_id);
      socket.emit('loadOldChat',getChat);

    })

      //broadcast chat
      socket.on('newChat', (data) => {
        socket.broadcast.emit('loadNewChat', data)
      })

  } catch (error) {
    console.log(error);
  }
  socket.on('disconnect', async () => {
    console.log(`socket ${socket.id} disconnected`);
    try {
      const change = await userRepositories.updateIsOnline(userId._id, '0');
      console.log(change.is_online);

      socket.broadcast.emit('user_offline_event', userId._id);

    } catch (error) {
      console.log(error);
    }
  });
});


//route

httpServer.listen(3000, () => {
  console.log("server is running on port 3000");
  connectToMongoDB();
})
