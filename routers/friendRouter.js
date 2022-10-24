const express = require('express');
const {FriendController} = require(`../controllers/friendController`)
const friendRouter = express.Router();

friendRouter.get('/:requester',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.friendList();
});

friendRouter.get('/block/:requester',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.blockList();
});

friendRouter.post('/block',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.block();
});

friendRouter.post('/',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.requestFriend();
});

friendRouter.put('/',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.acceptFriend();
});

friendRouter.delete('/',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.deleteFriend();
});

friendRouter.delete('/block',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.deleteBlock();
});

module.exports = friendRouter;
