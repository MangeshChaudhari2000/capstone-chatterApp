import mongoose from 'mongoose';
import { ChatModel } from '../models/chat.model.js';
import { ObjectId } from 'mongodb';

export default class ChatRepositories {

    async saveChat(obj) {
        try {
            const add = new ChatModel(obj)
            const save = await add.save();
            if (save) {
                return add;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getChat(id1, id2) {
        try {
            const chat = await ChatModel.find({
                $or: [
                    {
                        sender_id: new ObjectId(id1),
                        receiver_id: new ObjectId(id2)
                    },
                    {
                        sender_id: new ObjectId(id2),
                        receiver_id: new ObjectId(id1)
                    }]
            })

            return chat;

        } catch (error) {
            console.log(error);
        }
    }
}