const express = require('express');
const {FriendController} = require(`../controllers/friendController`)
const friendRouter = express.Router();

friendRouter.post('/signup',function(request,response){
    const friendController = new FriendController(request,response)
    friendController.addUserData();
});

friendRouter.post('/request',function(request,response){
    const friendController = new FriendController(request,response)
    friendController.requestFriend();
});

friendRouter.put('/accept',function(request,response){
    const friendController = new FriendController(request,response)
    friendController.addUserData();
});

module.exports = friendRouter;
