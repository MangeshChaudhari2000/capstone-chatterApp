import express from 'express';
import ChatRepositories from '../repositories/chat.repository.js';

export default class ChatController {

    constructor() {
        this.chatRepository = new ChatRepositories();
    }


    async saveChat(req, res) {
        try {

            const obj = {
                sender_id: req.body.sender_id,
                receiver_id:req.body.receiver_id,
                message:req.body.message
            }

            const add = await this.chatRepository.saveChat(obj);
            if (add) {
                res.status(200).send({success:true,message:"Chat Inserted!",data:add})
            } else {
                res.status(400).send({success:false,message:"Chat Not Inserted!"})

            }

        } catch (error) {
            console.log(error);
            res.status(400).send({success:false,message:"Error while inserting chat"})

        }
    }
}