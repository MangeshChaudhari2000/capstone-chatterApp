import express from 'express';

import { upload } from '../utlis/multer.js';
import jwtAuth from '../middlewares/jwtAuth.middleware.js';
import ChatController from '../controllers/chat.controller.js';

const chatController = new ChatController();

const chatRoute = express.Router();

chatRoute.post('/saveChat',jwtAuth, (req, res) => { chatController.saveChat(req, res) })

export default chatRoute;
