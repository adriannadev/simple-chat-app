const express = require('express');
const router = express.Router();
const { Chat } = require("../models/Chat");

router.get("/getChat", (req, res) => {
   Chat.find()
   .populate("sender")
   .exec((err, chat)=>{
       if(err) return res.status(400).send(err);
       res.status(200).send(chat);
   })
});

module.exports = router;