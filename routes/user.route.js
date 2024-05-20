import express from 'express';

import { upload } from '../utlis/multer.js';
import { UserController } from '../controllers/user.controller.js';
import jwtAuth from '../middlewares/jwtAuth.middleware.js';

const userRoute = express.Router();

// userRoute.use(bodyParser.json());
// userRoute.use(bodyParser.urlencoded({ extended: true }));
// userRoute.use(express.static('public'));

// userRoute.set('view-engine', 'ejs');
// userRoute.set('views', path.join(path.resolve()), "src", "views");

const userController = new UserController();

userRoute.get('/', (req, res) => {
    userController.loadHomePage(req, res)
});

userRoute.get('/register', (req, res) => {
    userController.loadRegisterPage(req, res)
});

userRoute.get('/setting',jwtAuth, (req, res) => {
    userController.loadSettingsPage(req, res)
});

userRoute.post('/setting',jwtAuth,upload.single('image'), (req, res) => {
    userController.changeSetting(req, res)
});
userRoute.get('/dashboard',jwtAuth, (req, res) => {
    userController.loadDashboard(req, res)
});

userRoute.post('/register', upload.single('image'), (req, res) => {
    userController.register(req, res)
});

userRoute.post('/login', (req, res) => {
    userController.loginUser(req, res)
});

userRoute.get('/logout',jwtAuth, (req, res) => {
    userController.logout(req, res)
});

userRoute.get('*', (req, res) => {
    res.redirect('/')
});



export default userRoute;
