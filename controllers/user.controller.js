import express from 'express';
import bcrypt from 'bcrypt';
import UserRepositories from '../repositories/user.repository.js';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import fs from 'fs';
import path from 'path';

export class UserController {

    constructor() {
        this.userRepository = new UserRepositories();
    }

    async loadHomePage(req, res) {
        try {
            res.render('homePage', { message: { status: null, text: "" } }); // Pass message data to the view
        } catch (error) {
            console.log(error);
        }
    }


    async loadRegisterPage(req, res) {
        try {
            res.render('registrationPage', { message: { status: null, text: "" } })
        } catch (error) {
            console.log(error);
        }

    }

    async register(req, res) {
        try {
            const { name, email } = req.body;

            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            var img = fs.readFileSync(path.join(path.resolve() + '/public/profile/' + req.file.filename));
            var encryptedImage = img.toString('base64');
            const obj = {
                name, email, password: hashedPassword, image: {
                    data: Buffer.from(encryptedImage, 'base64'),
                    contentType: `$(req.file.mimetype)`
                }
            }


            const add = await this.userRepository.register(obj);
            if (add) {
                res.render('homePage', { message: { status: true, text: "Registered Successfully" } })
            } else {
                res.render('homePage', { message: { status: false, text: "Error occured while registration" } })

            }

        } catch (error) {
            console.log(error);
        }
    }

    async loginUser(req, res) {
        try {
            const isSignin = await this.userRepository.findByEmail(req.body.email);
            if (isSignin) {
                const ispasswordMatched = await bcrypt.compare(req.body.password, isSignin.password)
                if (ispasswordMatched) {
                    //1.create token
                    const token1 = jwt.sign(
                        {
                            userID: isSignin._id,
                            email: isSignin.email
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1h'
                        }
                    )
                    req.session.token = token1;
                    req.session.data = isSignin;


                    res.redirect('/dashboard');

                    // res.status(200).send(" SignIn Successfully")
                } else {
                    return res.render('homePage', { message: { text: 'Password Not Matched', status: false } });
                }
            } else {
                return res.render('homePage', { message: { text: 'Email ID Does not exist', status: false } });

            }

        } catch (error) {
            console.log(error);
            return res.render('homePage', { message: { text: 'Error occured while SignIN', status: false } });

        }


    }

    async logout(req, res) {
        try {
            req.session.destroy();
            res.render('homePage', { message: { text: 'LogOut Successfully', status: true } })

        } catch (error) {
            console.log(error);
        }
    }

    async loadDashboard(req, res) {
        try {
            console.log("into dashboard");
            const getAllUsers = await this.userRepository.getAllUsers(req.session.data._id);
            // Prepare user data with image as base64
            const usersWithImages = getAllUsers.map(user => {
                const imageBase64 = user.image.data.toString('base64');
                const imageSrc = `data:${user.image.contentType};base64,${imageBase64}`;
                return {
                    ...user,
                    imageSrc
                };
            });
            res.render('dashboard', { user: { data: req.session.data, users: usersWithImages } })
        } catch (error) {

        }
    }

    async loadSettingsPage(req, res) {
        try {
            var name1 = req.session.data.name;
            var image1 = req.session.data.image;

            res.render('setting', { message: { status: null, text: "", name: name1, image: image1 } })
        } catch (error) {
            console.log(error);
        }

    }

    async changeSetting(req, res) {
        try {
            const userId = req.session.data._id;

            const image = 'profile/' + req.file.filename
            const isUpdated = await this.userRepository.updateUser(userId, req.body.name, req.body.password, image);
            if (isUpdated) {
                res.render('setting', { message: { status: true, text: "Profile Updated Successfully" } })
            } else {
                if (isUpdated) {
                    res.render('setting', { message: { status: false, text: "Error with updating profile" } })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

}


