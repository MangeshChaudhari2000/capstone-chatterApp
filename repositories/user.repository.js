import mongoose from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { ObjectId } from 'mongodb';
export default class UserRepositories {
    async register(obj) {
        try {
            const add = new UserModel(obj)
            const save = await add.save();
            if (save) {
                return add;

            }
        } catch (error) {
            console.log(error);
        }
    }

    async findByEmail(emailId) {
        try {
            const email = await UserModel.findOne({ email: emailId })
            return email;
        } catch (error) {
            console.log(error);
        }
    }


    async getAllUsers(userId) {
        try {
            const users = await UserModel.find({ _id: { $nin: userId } })
            return users
        } catch (error) {
            console.log(error);

        }
    }

    async updateIsOnline(userId, value) {
        try {
            const users = await UserModel.findByIdAndUpdate({ _id: new ObjectId(userId) }, { is_online: value })
            return users.save();
        } catch (error) {
            console.log(error);

        }
    }

    async updateUser(userId, name, password, image) {
        try {
            const users = await UserModel.findById({ _id: new ObjectId(userId) });
            if (name!='') {
                users.name = name;
                await users.save();
            }
            if (password!='') {
                const hashedPassword = await bcrypt.hash(password, 12);

                users.password = hashedPassword;
                await users.save();
            }
            if (image!='') {
                users.image = image;
                await users.save();
            }
            return users;
        } catch (error) {
            console.log(error);

        }
    }
}